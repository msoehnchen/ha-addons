const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { NiceLog, CreateServerOptions } = require('../utils/utils');
const hautils = require('../utils/ha-utils');
const todoDb = require('../db/todo-db');
const userDb = require('../db/user-db');

NiceLog('Debug login-routes.js: Initializing login routes');


// Login route GET
router.get('/', (req, res) => {
  try {
    NiceLog(`DEBUG-ROUTES: Login route accessed`);
    res.render('login');
  } catch (err) {
    res.status(500).json({ error: `Failed to render login page. Error: ${err.message}` });
  }
});


// Login route POST
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userDb.findUser(username); // Implement findUser in user-db.js
    if (user && bcrypt.compareSync(password, user.password)) { // Use hashed passwords in production!
      req.session.user = { username: user.username };
      NiceLog(`Debug Login-routes: User "${username}" succesfull authenticated.`)
      return res.json({ success: true });
    } else {
        NiceLog(`Debug Login-routes: User "${username}" tried with incorrect credentials!`)
      return res.status(401).json({ error: `Invalid credentials... ${username}` });
    }
  } catch (err) {
    NiceLog(`Debug Login-routes: Error during POST request: Err = ${err.message}`)
    return res.status(500).json({ error: 'Login error' });
  }
});





module.exports = router;
