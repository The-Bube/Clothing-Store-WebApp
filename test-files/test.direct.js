console.log('1. Starting...');

const bcrypt = require('bcrypt');
console.log('2. bcrypt loaded');

const mysql = require('mysql2/promise');
console.log('3. mysql loaded');

console.log('4. About to load user.js...');
const UserAuth = require('../backend/models/user.js');
console.log('5. UserAuth loaded:', UserAuth);

console.log('6. Checking UserAuth properties:');
console.log('   - UserAuth.login:', typeof UserAuth.login);
console.log('   - UserAuth.register:', typeof UserAuth.register);