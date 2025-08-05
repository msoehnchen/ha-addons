const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { NiceLog, CreateServerOptions } = require('../utils/utils');
const hautils = require('../utils/ha-utils');
const todoDb = require('../db/todo-db');
const userDb = require('../db/user-db');

NiceLog('Debug logout-routes.js: Initializing logout routes');


// //Login route GET
// router.get('/', (req, res) => {
//   try {
//     NiceLog(`DEBUG-ROUTES: Logout route accessed`);
//     res.render('login');
//   } catch (err) {
//     res.status(500).json({ error: `Failed to render logout page. Error: ${err.message}` });
//   }
// });


// Logout route POST
router.get('/', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      NiceLog(`Debug Logout-route: Error destroying session: ${err.message}`);
      return res.status(500).json({ error: 'Logout failed' });
    }
    NiceLog('Clearing cookies from user...')
    res.clearCookie('connect.sid'); // or your session cookie name
    //return res.json({ success: true });
    res.render('login');
  });
});





module.exports = router;
