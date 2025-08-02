const bsqlite3 = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
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
function _addInitialSetupUser(flag_force = false) {
  const userCount = getUserCount();
  if (userCount === 0 || flag_force) {
    NiceLog('Debug user-db.js: No users found, creating initial setup user.');
    const username = hautils.getAddonOptions().admin_user;
    const hashedPassword = bcrypt.hashSync(hautils.getAddonOptions().admin_password, 10);
    userDb.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
      .run(username, hashedPassword, 'setup');
    NiceLog(`Debug user-db.js: Initial setup user created with username: ${username} and password: ${hautils.getAddonOptions().admin_password}`);
  } else {
    if (getRoleByUsername(hautils.getAddonOptions().admin_user) === 'setup') {
      NiceLog('Debug user-db.js: Initial setup user already exists.');
    } else {
      NiceLog('Debug user-db.js: Initial setup user exists but has a different role, not setup.');
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

// find a user by username and return the a user object with the username, password and role
function findUser(username) {
  const stmt = userDb.prepare('SELECT username, password, role FROM users WHERE username = ?');
  const user = stmt.get(username);
  if (user) {
    return {
      username: user.username,
      password: user.password, // In production, use hashed passwords!
      role: user.role
    };
  } else {
    NiceLog(`Debug user-db.js: No user found with username: ${username}`);
    return null;
  }
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

function createDatabase() {
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
}


// function to remove the user database
function removeDatabase() {
  NiceLog(`Debug user-db.js: Removing user database at ${userDbFile}`);
  userDb.close();
  try {
    fs.unlinkSync(userDbFile);
    NiceLog(`Debug user-db.js: User database removed successfully.`);
  } catch (err) {
    NiceLog(`Debug user-db.js: Error removing user database: ${err.message}`);
  }
}

createDatabase()

// check for config option to reset database....
if (hautils.getAddonOptions().reset_user_database) {
  removeDatabase();
  createDatabase();
}

_addInitialSetupUser();


// Debug: get role by username
const debug_role = getRoleByUsername(hautils.getAddonOptions().admin_user);
NiceLog(`Debug user-db.js: Role for user ${hautils.getAddonOptions().admin_user} is ${debug_role}`);


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
  getUserCount,
  removeDatabase,
  findUser
};