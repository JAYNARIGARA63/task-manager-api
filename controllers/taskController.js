const Task = require("../models/taskModel");

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.getAllTasks();
  res.json(tasks);
};
