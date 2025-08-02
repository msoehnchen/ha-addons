const express = require('express');
const router = express.Router();
const { NiceLog } = require('../utils/utils');
const hautils = require('../utils/ha-utils');
const { requireApiToken, requireLogin } = require('../utils/express-session-auth');
const todoDb = require('../db/todo-db');
const userDb = require('../db/user-db');

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
    userDb.removeDatabase();  
  return { message: 'Remove database action executed successfully', dbName: dbname };
  } else {
    return { message: 'No action taken', dbName: dbname };
  }
}

router.get('/api/removedb', (req, res) => {
  const dbName = req.query.db;
  const result = RemoveDb(dbName);
  res.json(result);
});

module.exports = router;