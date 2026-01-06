// server.js
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require("mysql2");              // ✅ added for views
const UserAuth = require('./models/user.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 24*60*60*1000 
  }
}));

const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

const PORT = 3000;

// ✅ DB POOL FOR DASHBOARD VIEWS
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "greatGod",          // use your real MySQL password
  database: "retail_store",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Helper to run SELECT queries for the views
function runQuery(sql, res) {
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
}

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Please login to continue' });
  }
};

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ Dashboard Views 1–10 NOW READ FROM YOUR SQL VIEWS
app.get("/api/view1",  (req, res) => runQuery("SELECT * FROM View1_OrderSummary", res));
app.get("/api/view2",  (req, res) => runQuery("SELECT * FROM View2_HighSpenders", res));
app.get("/api/view3",  (req, res) => runQuery("SELECT * FROM View3_AboveAverageOrders", res));
app.get("/api/view4",  (req, res) => runQuery("SELECT * FROM View4_FullProductInventory", res));
app.get("/api/view5",  (req, res) => runQuery("SELECT * FROM View5_AllUsers", res));
app.get("/api/view6",  (req, res) => runQuery("SELECT * FROM View6_PendingOrders", res));
app.get("/api/view7",  (req, res) => runQuery("SELECT * FROM View7_InventoryValueByLocation", res));
app.get("/api/view8",  (req, res) => runQuery("SELECT * FROM View8_OrderItemCount", res));
app.get("/api/view9",  (req, res) => runQuery("SELECT * FROM View9_LowStockProducts", res));
app.get("/api/view10", (req, res) => runQuery("SELECT * FROM View10_CompletedOrdersSummary", res));

// HTML Routes
app.get('/login.html', (req, res) => res.sendFile(path.join(frontendPath, 'login.html')));
app.get('/password-login.html', (req, res) => res.sendFile(path.join(frontendPath, 'password-login.html')));
app.get('/signup-login.html', (req, res) => res.sendFile(path.join(frontendPath, 'signup-login.html')));

// Authentication API Routes
app.post('/api/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const exists = await UserAuth.emailExists(email);
    res.json({ exists });
  } catch (err) {
    console.error('Email check error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const result = await UserAuth.login(email, password);
    
    if (result.success) {
      req.session.userId = result.user.user_id;
      req.session.userRole = result.user.role_id;
    }
    
    res.json(result);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const result = await UserAuth.register(fullName, email, phone, password);
    
    if (result.success) {
      req.session.userId = result.user_id;
      req.session.userRole = 1; // Default role for new users
    }
    
    res.json(result);
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

app.get('/api/user', requireAuth, async (req, res) => {
  try {
    const result = await UserAuth.getUserById(req.session.userId);
    res.json(result);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/user/profile', requireAuth, async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const result = await UserAuth.updateProfile(req.session.userId, fullName, phone);
    res.json(result);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/user/password', requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await UserAuth.changePassword(req.session.userId, oldPassword, newPassword);
    res.json(result);
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/auth/status', (req, res) => {
  res.json({
    authenticated: !!req.session.userId,
    userId: req.session.userId || null,
    roleId: req.session.userRole || null
  });
});

app.get('/api/user/orders', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const result = await UserAuth.getUserOrders(userId);
    res.json(result);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/user/orders/:orderId', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const orderId = req.params.orderId;
    const result = await UserAuth.getOrderDetails(orderId, userId);
    res.json(result);
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Root: go to login first, NOT dashboard
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
