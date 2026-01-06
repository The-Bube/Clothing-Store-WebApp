const UserAuth = require('../backend/models/user.js');

async function testDirectLogin() {
  try {
    console.log('Testing login for sarah.thompson@email.com...');
    const result = await UserAuth.login('sarah.thompson@email.com', 'hash1');
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
  process.exit();
}

testDirectLogin();