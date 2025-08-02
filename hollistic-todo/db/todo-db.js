const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const { NiceLog } = require('../utils/utils');
const hautils = require('../utils/ha-utils');

// check if folder data exists, if not use data_local
let datafolder = '/data';
if (!hautils.directoryExists(datafolder)) {
  datafolder = path.join(__dirname, '..', '/data_local');
}

const dbPath = path.join(datafolder, 'todo.db');
NiceLog(`Debug todo-db.js: Using database at: ${dbPath}`);

const todoDb = new Database(dbPath);

// Create the todos table if it doesn't exist
todoDb.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    title TEXT,
    start_date TEXT,
    end_date TEXT,
    priority TEXT,
    category TEXT,
    completed_at TEXT
  )
`);



module.exports = todoDb;

