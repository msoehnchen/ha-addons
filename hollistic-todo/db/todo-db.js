const path = require('path');
const fs = require('fs');
const { appSettings } = require('../app-config')
const Database = require('better-sqlite3');
const { NiceLog } = require('../utils/utils');
const hautils = require('../utils/ha-utils');


const dbPath = path.join(hautils.getDataFolder(), appSettings.dbs.todo.filename);
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

