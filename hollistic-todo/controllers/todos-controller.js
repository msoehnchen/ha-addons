const todoDb = require('../db/todo-db');
const userDb = require('../db/user-db');
const { NiceLog } = require('../utils/utils');

/** * Adds a new todo item to the database.
 * @param {Object} data - The todo
 * data.
 * @param {string} data.text - The text of the todo item. 
 * @param {string} [data.title] - The title of the todo item.
 * @param {string} [data.start_date] - The start date of the todo item.
 * @param {string} [data.end_date] - The end date of the todo item.
 * @param {string} [data.priority] - The priority of the todo item.
 * @param {string} [data.category] - The category of the todo item. 
 * @return {Object} The inserted todo item with its ID.
 */  
function addTodo(data) {
  const { text, title, start_date, end_date, priority, category } = data;

  if (!text || text.trim() === '') {
    throw new Error('Todo text is required');
  }

  const stmt = todoDb.prepare(`
    INSERT INTO todos (text, title, start_date, end_date, priority, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(text, title || null, start_date || null, end_date || null, priority || null, category || null);

  return { id: result.lastInsertRowid, title: result.title };
};

module.exports = {
  addTodo
};
