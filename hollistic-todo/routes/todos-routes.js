const express = require('express');
const router = express.Router();
const { addTodo } = require('../controllers/todos-controller');
const { NiceLog } = require('../utils/utils');
const todoDb = require('../db/todo-db');
const userDb = require('../db/user-db');


router.post('/', (req, res) => {
  try {
    const result = addTodo(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', (req, res) => {
  try {
    const todos = todoDb.prepare('SELECT * FROM todos ORDER BY id DESC').all();
    NiceLog(`Fetched ${todos.length} todos`);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

module.exports = router;