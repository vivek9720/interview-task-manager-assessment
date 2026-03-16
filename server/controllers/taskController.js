const Task = require("../models/Task");

// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { status, search } = req.query;

    let filter = { user: req.user._id };

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim() !== "") {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err.message);
    res.status(500).json({ message: "Could not fetch tasks" });
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // make sure the task belongs to the logged in user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to access this task" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch task" });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || "",
      status: status || "Pending",
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err.message);
    res.status(500).json({ message: "Could not create task" });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to update this task" });
    }

    const { title, description, status } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    console.error("Update task error:", err.message);
    res.status(500).json({ message: "Could not update task" });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this task" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err.message);
    res.status(500).json({ message: "Could not delete task" });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
