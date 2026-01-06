const path = require('path');
const userPath = path.join(__dirname, 'models', 'user.js');
console.log('Loading from:', userPath);
const UserAuth = require(userPath);
console.log('UserAuth:', UserAuth);
console.log('UserAuth.login:', UserAuth.login);