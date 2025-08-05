const path = require('path');
const express = require('express');
const router = express.Router();
const { NiceLog } = require('../utils/utils');
const hautils = require('../utils/ha-utils');
const { appSettings } = require('../app-config')
const { requireApiToken, requireLogin } = require('../utils/express-session-auth');
const todoDb = require('../db/todo-db');
const userDb = require('../db/user-db');
const { route } = require('./todos-routes');
const session = require('express-session');

NiceLog('Debug debug-routes.js: Initializing debug routes');



// Apply the middleware to all routes in this router
//router.use(requireApiToken); // Uncomment this line if you want to require API token for all debug routes


// main entry of this debug route. It will serve ejs file debug.ejs from views folder.
router.get('/', requireLogin, (req, res) => {
  try {
    NiceLog(`DEBUG-ROUTES: Debug route accessed`);
    res.render('debug', { version: hautils.ReadVersionFromAddonConfig() });
  } catch (err) {
    res.status(500).json({ error: `Failed to render debug page. Error: ${err.message}` });
  }
});

function APIdoSomething(value_boolean) {
  NiceLog(`Debug debug-routes.js: APIdoSomething called with value: ${value_boolean}`);
  // This is a placeholder for an API action that can be called from the debug page
  return { message: 'API action executed successfully', receivedValue: value_boolean };
}

router.get('/api/something', requireApiToken, (req, res) => {
  const testValue = req.query.testvalue;
  const result = APIdoSomething(testValue);
  res.json(result);
});

function RemoveDb(dbname) {
  NiceLog(`Debug debug-routes.js: RemoveDb called with dbname: ${dbname}`);
  // This is a placeholder for an API action that can be called from the debug page
  if (dbname === 'user') {
    //userDb.removeDatabase();  
  return { message: 'API Call executed succesful, however databse was not removed. Please use "reset_user_database" config-option for that.', dbName: dbname };
  } else {
    return { message: 'No action taken', dbName: dbname };
  }
}

router.get('/api/removedb', (req, res) => {
  const dbName = req.query.db;
  const result = RemoveDb(dbName);
  res.json(result);
});



// download the todo database file
function downloadDatabaseTodo() {
  const dbPath = hautils.getDataFolder();
  return {dbPath};
}

router.get('/api/download-todo', requireLogin, (req, res) => {
  NiceLog('Debug debug-routes.js: hit endpoint /api/download-todo')
  const downloadfile = downloadDatabaseTodo()
  NiceLog(`Debug debug-routes.js: User wants ${JSON.stringify(req.session.user)} to download ${downloadfile.dbPath} / ${appSettings.dbs.todo.filename}`)
  res.setHeader('Content-Disposition', `attachment; filename="${appSettings.dbs.todo.filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.download(path.join(downloadfile.dbPath, appSettings.dbs.todo.filename), appSettings.dbs.todo.filename, (err) => {
    if (err) {
      NiceLog(`Debug debug-routes.js: error while trying to download ${downloadfile.dbPath} / ${appSettings.dbs.todo.filename}: ${err.message}`)
      res.status(500).send(`Error downloading file`)
    }
  } )
});


module.exports = router;