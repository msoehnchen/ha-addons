const bsqlite3 = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');
const { NiceLog } = require('../utils/utils');
const hautils = require('../utils/ha-utils');


// check if folder data exists, if not use data_local
let datafolder = '/data';
if (!hautils.directoryExists(datafolder)) {
  datafolder = path.join(__dirname, '..', '/data_local');
}

const userDbFile = path.join(datafolder, 'user.db');
NiceLog(`Debug user-db.js: Using user database at: ${userDbFile}`);

const userDb = new bsqlite3(userDbFile);





// function to get count of users in the database
function getUserCount() {
  const stmt = userDb.prepare('SELECT COUNT(*) as count FROM users');
  const result = stmt.get();
  return result.count;
}

// function to add initial setupuser if not exists
function _addInitialSetupUser() {
  const userCount = getUserCount();
  if (userCount === 0) {
    NiceLog('Debug user-db.js: No users found, creating initial setup user.');
    const hashedPassword = bcrypt.hashSync('setmenow', 10);
    userDb.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
      .run('setupuser', hashedPassword, 'setup');
    NiceLog('Debug user-db.js: Initial setup user created with username: setupuser and password: setmenow');
  } else {
    if (getRoleByUsername('setupuser') === 'setup') {
      NiceLog('Debug user-db.js: Initial setup user already exists.');
    }
    NiceLog(`Debug user-db.js: User count in database: ${userCount}`);
  }
}

// function to add a new user with hashed password
function addUser(username, password, role = 'user') {
  const hashedPassword = bcrypt.hashSync(password, 10);
  userDb.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
    .run(username, hashedPassword, role);
}

// get all users from the database
function getAllUsers() {
  const stmt = userDb.prepare('SELECT * FROM users');
  return stmt.all();
}

// get role by username
function getRoleByUsername(username) {
  const stmt = userDb.prepare('SELECT role FROM users WHERE username = ?');
  const user = stmt.get(username);
  
  if (user) {
    return user.role;
  } else {
    NiceLog(`Debug user-db.js: No user found with username: ${username}`);
    return null;
  }
}

// Create the users table if it doesn't exist
userDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL unique,
    password TEXT NOT NULL,
    role TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`);

_addInitialSetupUser();


// Debug: get role by username
const debug_role = getRoleByUsername('setupuser');
NiceLog(`Debug user-db.js: Role for user 'setupuser' is ${debug_role}`);


// Debug: add a random user
function _addRandomUser() {
  const randomUsername = `user${Math.floor(Math.random() * 1000)}`;
  const randomPassword = `pass${Math.floor(Math.random() * 1000)}`;
  addUser(randomUsername, randomPassword, role = 'random');
  NiceLog(`Debug user-db.js: Added random user: ${randomUsername}`);
}
_addRandomUser(); 

module.exports = {
  userDb,
  getRoleByUsername,
  getAllUsers,
  getUserCount
};