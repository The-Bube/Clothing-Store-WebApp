const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'greatGod',  // Update with your MySQL password
  database: 'retail_store'  // Update with your database name
};

async function hashAllPasswords() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Get all users
    const [users] = await connection.execute('SELECT user_id, email, password_hash FROM UserAccount');
    
    console.log(`Found ${users.length} users to update:`);
    
    for (const user of users) {
      // If password is already hashed (starts with $2b$), skip it
      if (user.password_hash.startsWith('$2b$')) {
        console.log(`✓ ${user.email} - already hashed, skipping`);
        continue;
      }
      
      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(user.password_hash, 10);
      
      // Update in database
      await connection.execute(
        'UPDATE UserAccount SET password_hash = ? WHERE user_id = ?',
        [hashedPassword, user.user_id]
      );
      
      console.log(`✓ Updated ${user.email}`);
      console.log(`  Original password: ${user.password_hash}`);
      console.log(`  New hash: ${hashedPassword.substring(0, 30)}...`);
    }
    
    console.log('\n✅ All passwords hashed successfully!');
    console.log('You can now login using the ORIGINAL passwords (hash1, hash2, etc.)');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

hashAllPasswords();