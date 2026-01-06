const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'Joseph2005##',
  database: 'retail_store'
};

async function resetSarah() {
  const connection = await mysql.createConnection(dbConfig);
  
  // Hash a new password
  const newPassword = 'password123';
  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  // Update Sarah's password
  await connection.execute(
    'UPDATE UserAccount SET password_hash = ? WHERE email = ?',
    [passwordHash, 'sarah.thompson@email.com']
  );
  
  console.log('✅ Password reset!');
  console.log('Login with:');
  console.log('  Email: sarah.thompson@email.com');
  console.log('  Password: password123');
  
  await connection.end();
}

resetSarah();