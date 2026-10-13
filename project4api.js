//Name: Buddie Powell
// Section: Mon/wens hybrid 10:30am to 12:100pm
//date: 5/12/26

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3001;
const TASKS_FILE = path.join(__dirname, "tasks.json");

// gets directory name and json
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// tasks data
let tasksData = {};

if (fs.existsSync(TASKS_FILE)) {
  const rawData = fs.readFileSync(TASKS_FILE, "utf8");
  tasksData = JSON.parse(rawData);
} else {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasksData, null, 2));
}

const saveTasks = () => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasksData, null, 2));
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/tasks/:id", (req, res) => {
  const studentId = req.params.id;
  const studentTasks = tasksData[studentId] || [];
  res.set("Content-Type", "application/json");
  res.json(studentTasks);
});

app.post("/api/tasks", (req, res) => {
  const { description, studentId = "default" } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description required" });
  }

  if (!tasksData[studentId]) {
    tasksData[studentId] = [];
  }

  const newTask = {
    id: Date.now().toString(),
    description: description,
  };

  tasksData[studentId].push(newTask);
  saveTasks();

  res.status(201).json({
    message: "Task created",
    task: newTask,
  });
});
// deletes the id if the description is null, it wont be deleted
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  let description = null;
  if (req.body && typeof req.body === "object") {
    description = req.body.description || null;
  }

  let deleted = false;

  for (let studentId in tasksData) {
    if (tasksData[studentId]) {
      tasksData[studentId] = tasksData[studentId].filter((task) => {
        if (task.id !== taskId) return true;
        if (description && task.description !== description) return true;
        deleted = true;
        return false;
      });

      if (tasksData[studentId].length === 0) {
        delete tasksData[studentId];
      }
    }
  }

  if (deleted) {
    saveTasks();
    res.json({ message: "Task deleted successfully" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.get("/api/tasks", (req, res) => {
  const allTasks = Object.values(tasksData).flat();
  res.json(allTasks);
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
