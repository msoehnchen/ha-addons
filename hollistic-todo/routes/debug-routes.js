const express = require('express');
const router = express.Router();
const { NiceLog } = require('../utils/utils');
const hautils = require('../utils/ha-utils');
const todoDb = require('../db/todo-db');
const userDb = require('../db/user-db');

NiceLog('Debug debug-routes.js: Initializing debug routes');

// main entry of this debug route. It will serve ejs file debug.ejs from views folder.
router.get('/', (req, res) => {
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

router.get('/api/something', (req, res) => {
  const testValue = req.query.testvalue;
  const result = APIdoSomething(testValue);
  res.json(result);
});

module.exports = router;