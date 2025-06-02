const db = require("../db");

exports.getAllTasks = async () => {
  const result = await db.query("SELECT * FROM tasks ORDER BY id DESC");
  return result.rows;
};
