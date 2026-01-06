const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

// DATABASE CONFIG
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'greatGod',
  database: 'retail_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

class UserAuth {

  // CHECK IF EMAIL EXISTS
  static async emailExists(email) {
    let connection;
    try {
      connection = await pool.getConnection();

      const [rows] = await connection.execute(
        'SELECT user_id FROM UserAccount WHERE email = ?',
        [email]
      );

      return rows.length > 0;
    } catch (err) {
      console.error('Email check error:', err);
      throw err;
    } finally {
      if (connection) connection.release();
    }
  }

  // LOGIN USER
  static async login(email, password) {
    let connection;

    try {
      connection = await pool.getConnection();

      const [rows] = await connection.execute(
        `SELECT user_id, role_id, full_name, email, password_hash 
         FROM UserAccount WHERE email = ?`,
        [email]
      );

      if (rows.length === 0) {
        return { success: false, message: "Invalid email or password" };
      }

      const user = rows[0];

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return { success: false, message: "Invalid email or password" };
      }

      return {
        success: true,
        user: {
          user_id: user.user_id,
          role_id: user.role_id,
          full_name: user.full_name,
          email: user.email
        }
      };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Server error" };
    } finally {
      if (connection) connection.release();
    }
  }

  // REGISTER USER
  static async register(fullName, email, phone, password, roleId = 1) {
    let connection;

    try {
      connection = await pool.getConnection();

      // CHECK IF EMAIL EXISTS
      const [existing] = await connection.execute(
        `SELECT user_id FROM UserAccount WHERE email = ?`,
        [email]
      );

      if (existing.length > 0) {
        return { success: false, message: "Email already registered" };
      }

      // VALIDATE PASSWORD
      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await connection.execute(
        `INSERT INTO UserAccount (role_id, full_name, email, phone, password_hash)
         VALUES (?, ?, ?, ?, ?)`,
        [roleId, fullName, email, phone, hashedPassword]
      );

      console.log("User registered successfully:", result.insertId);

      return {
        success: true,
        user_id: result.insertId,
        message: "Registration successful"
      };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: "Server error: " + err.message };
    } finally {
      if (connection) connection.release();
    }
  }

  // GET USER BY ID
  static async getUserById(userId) {
    let connection;

    try {
      connection = await pool.getConnection();

      const [rows] = await connection.execute(
        `SELECT user_id, role_id, full_name, email, phone 
         FROM UserAccount WHERE user_id = ?`,
        [userId]
      );

      if (rows.length === 0) {
        return { success: false, message: "User not found" };
      }

      return { success: true, user: rows[0] };
    } catch (err) {
      console.error("Get user error:", err);
      return { success: false, message: "Server error" };
    } finally {
      if (connection) connection.release();
    }
  }

  // UPDATE PROFILE
  static async updateProfile(userId, fullName, phone) {
    let connection;

    try {
      connection = await pool.getConnection();

      const [result] = await connection.execute(
        `UPDATE UserAccount 
         SET full_name = ?, phone = ? 
         WHERE user_id = ?`,
        [fullName, phone, userId]
      );

      if (result.affectedRows === 0) {
        return { success: false, message: "User not found" };
      }

      return { success: true, message: "Profile updated successfully" };
    } catch (err) {
      console.error("Update profile error:", err);
      return { success: false, message: "Server error" };
    } finally {
      if (connection) connection.release();
    }
  }

  // CHANGE PASSWORD
  static async changePassword(userId, oldPassword, newPassword) {
    let connection;

    try {
      connection = await pool.getConnection();

      const [rows] = await connection.execute(
        `SELECT password_hash FROM UserAccount WHERE user_id = ?`,
        [userId]
      );

      if (rows.length === 0) {
        return { success: false, message: "User not found" };
      }

      const valid = await bcrypt.compare(oldPassword, rows[0].password_hash);

      if (!valid) {
        return { success: false, message: "Current password incorrect" };
      }

      const newHash = await bcrypt.hash(newPassword, 10);

      await connection.execute(
        `UPDATE UserAccount SET password_hash = ? WHERE user_id = ?`,
        [newHash, userId]
      );

      return { success: true, message: "Password changed successfully" };
    } catch (err) {
      console.error("Change password error:", err);
      return { success: false, message: "Server error" };
    } finally {
      if (connection) connection.release();
    }
  }

  // GET USER ORDERS
  static async getUserOrders(userId) {
    let connection;
    try {
      connection = await pool.getConnection();

      const [orders] = await connection.execute(
        `SELECT 
          o.order_id, 
          o.order_date, 
          o.status,
          COUNT(oi.product_id) as item_count,
          SUM(oi.quantity * oi.price) as total_amount
         FROM Orders o
         LEFT JOIN OrderItem oi ON o.order_id = oi.order_id
         WHERE o.customer_id = ?
         GROUP BY o.order_id, o.order_date, o.status
         ORDER BY o.order_date DESC`,
        [userId]
      );

      return { success: true, orders };
    } catch (err) {
      console.error("Get orders error:", err);
      return { success: false, message: "Server error" };
    } finally {
      if (connection) connection.release();
    }
  }

  // GET ORDER DETAILS
  static async getOrderDetails(orderId, userId) {
    let connection;
    try {
      connection = await pool.getConnection();

      const [order] = await connection.execute(
        `SELECT 
          o.order_id, 
          o.order_date, 
          o.status,
          SUM(oi.quantity * oi.price) as total_amount
         FROM Orders o
         LEFT JOIN OrderItem oi ON o.order_id = oi.order_id
         WHERE o.order_id = ? AND o.customer_id = ?
         GROUP BY o.order_id, o.order_date, o.status`,
        [orderId, userId]
      );

      if (order.length === 0) {
        return { success: false, message: "Order not found" };
      }

      const [items] = await connection.execute(
        `SELECT 
            oi.quantity,
            oi.price,
            p.name as product_name,
            p.description
         FROM OrderItem oi
         JOIN Product p ON oi.product_id = p.product_id
         WHERE oi.order_id = ?`,
        [orderId]
      );

      return {
        success: true,
        order: order[0],
        items
      };
    } catch (err) {
      console.error("Get order details error:", err);
      return { success: false, message: "Server error" };
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = UserAuth;