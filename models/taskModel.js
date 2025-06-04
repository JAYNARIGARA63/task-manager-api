const db = require("../db");

exports.getAllTasks = async () => {
  const result = await db.query("SELECT * FROM tasks ORDER BY id DESC");
  return result.rows;
};

exports.createTask = async (task) => {
  const { user_id, title, description } = task;
  const result = await db.query(
    "INSERT INTO tasks (user_id,title,description) VALUES ($1,$2,$3) RETURNING *",
    [user_id, title, description]
  );
  return result.rows[0];
};
