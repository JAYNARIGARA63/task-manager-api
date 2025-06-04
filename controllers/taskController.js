const Task = require("../models/taskModel");

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.getAllTasks();
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const taskBody = req.body;

  const newTask = await Task.createTask(taskBody);
  res.status(201).json(newTask);
};
