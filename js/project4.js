// Name: Buddie Powell
// Date: 05/14/2026
// Section: Advanced JavaScript Hybrid Mon/Wed 10:30AM - 12:10PM

// Reconfigured to point directly to the api localhost
const url = "http://localhost:3001/api/tasks";

// Global scope variables for DOM elements
let tasklist;
let maincontent;
let footer;

// Initializes the application
const init = () => {
  maincontent = document.querySelector("#main");
  footer = document.querySelector("footer");

  tasklist = document.createElement("ul");
  tasklist.setAttribute("id", "tasklist");
  tasklist.setAttribute("style", "list-style-type: none;");
  maincontent.appendChild(tasklist);

  document.querySelector("#addnewtask").addEventListener("click", addnewtask);
  displayalltasks();
};

// Display all tasks
const displayalltasks = async () => {
  console.log("Fetching tasks from local host...");
  tasklist.innerHTML = "";
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    let data = await response.json();
    let tasksArray = Array.isArray(data) ? data : Object.values(data);

    tasksArray.forEach((task) => {
      createTaskListItem(task);
    });
  } catch (error) {
    console.log("Error fetching tasks:", error);
  }
};

// Create task list item
const createTaskListItem = (task) => {
  let li = document.createElement("li");
  li.setAttribute("style", "margin-bottom: 10px;");
  let span = document.createElement("span");

  let taskDesc = task.description || "No Description";
  span.textContent = taskDesc + " ";
  li.appendChild(span);

  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("style", "margin-left: 10px; cursor: pointer;");

  // deletes the taskid and task description
  deleteBtn.addEventListener("click", () => deleteTask(task.id, taskDesc));
  li.appendChild(deleteBtn);
  tasklist.appendChild(li);
};

// Delete task by ID
const deleteTask = async (taskId, taskDesc) => {
  console.log(`Deleting task ID: ${taskId}...`);
  try {
    let response = await fetch(`${url}/${taskId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: taskDesc }),
    });

    if (response.ok) {
      console.log("Task deleted successfully from backend database");
      displayalltasks();
    } else {
      console.log("Delete failed:", response.status);
    }
  } catch (error) {
    console.log("Error deleting task:", error);
  }
};
// Add new task
const addnewtask = async () => {
  console.log("Adding new task...");
  let taskInput = document.querySelector("#taskdescription");
  let taskDescription = taskInput.value.trim();

  if (taskDescription === "") {
    console.log("Task description cannot be empty");
    return;
  }

  let taskData = { description: taskDescription };

  try {
    let taskresponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (taskresponse.ok) {
      console.log("Task added successfully to backend database");
      taskInput.value = "";
      displayalltasks();
    }
  } catch (error) {
    console.log("Error adding task:", error);
  }
};

window.onload = init;
