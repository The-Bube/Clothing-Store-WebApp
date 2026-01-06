const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',              // Update this
  password: 'Joseph2005##',  // Update this
  database: 'retail_store'        // Update this
};

async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✓ Database connected successfully!');
    
    const [rows] = await connection.execute('SELECT * FROM UserAccount LIMIT 1');
    console.log('✓ UserAccount table found!');
    console.log('Sample user:', rows[0]);
    
    await connection.end();
  } catch (error) {
    console.error('✗ Database connection failed:');
    console.error(error.message);
  }
}

testConnection();