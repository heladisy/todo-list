class Task {
  constructor(text, type, date) {
    this.text = text;
    this.type = type;
    this.date = date;
    this.completed = false;
  }

  createTaskElement() {
    const taskItem = document.createElement("li");
    taskItem.className = `task-item ${this.type}`;

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = this.completed;
    taskCheckbox.addEventListener("change", () => {
      this.completed = taskCheckbox.checked;
      taskTextElement.classList.toggle("done", this.completed);
    });

    const taskTextElement = document.createElement("span");
    taskTextElement.textContent = this.text;
    if (this.completed) taskTextElement.classList.add("done");

    const editBtn = this.createButton("edit", () =>
      this.openEditModal(taskTextElement)
    );
    const deleteBtn = this.createButton("delete", () => {
      TaskManager.removeTask(this, taskItem);
      taskManager.updateTaskCount(this.date);
    });

    const typeIcon = document.createElement("span");
    typeIcon.textContent = this.type === "habit" ? "🌱" : "📌";

    taskItem.append(
      taskCheckbox,
      typeIcon,
      taskTextElement,
      editBtn,
      deleteBtn
    );
    return taskItem;
  }

  openEditModal(taskTextElement) {
    const modal = document.getElementById("task-edit");
    const editInput = document.getElementById("task-textedit");
    const saveBtn = document.getElementById("save-btn");

    editInput.value = this.text;
    modal.classList.add("active");
    editInput.focus();

    saveBtn.onclick = () => {
      const newText = editInput.value.trim();
      if (!newText) {
        alert("Task text cannot be empty!");
        return;
      }
      this.text = newText;
      taskTextElement.textContent = newText;
      closeEditModal();
    };

    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const newText = editInput.value.trim();
        if (!newText) {
          alert("Task text cannot be empty!");
          return;
        }
        this.text = newText;
        taskTextElement.textContent = newText;
        closeEditModal();
      }
    });
  }

  createButton(type, handler) {
    const btn = document.createElement("button");
    btn.textContent = type === "edit" ? "✏️" : "❌";
    btn.classList.add(`${type}-btn`);
    btn.addEventListener("click", handler);
    return btn;
  }
}

class TaskManager {
  constructor() {
    this.tasksByDate = new Map();
    this.currentDate = new Date();
    this.listContainer = document.getElementById("list-container");
    this.taskCounter = document.getElementById("completed-counter");
  }

  addTask(text, type, date) {
    const task = new Task(text, type, date);
    const dateStr = date.toDateString();
    if (!this.tasksByDate.has(dateStr)) this.tasksByDate.set(dateStr, []);
    this.tasksByDate.get(dateStr).push(task);
    this.renderTasks(date);
    this.updateTaskCount(date);
  }

  static removeTask(task, taskElement) {
    const dateStr = task.date.toDateString();
    const tasks = taskManager.tasksByDate.get(dateStr);
    if (tasks) {
      const index = tasks.indexOf(task);
      if (index > -1) tasks.splice(index, 1);
    }
    taskElement.remove();
    taskManager.renderTasks(task.date);
    taskManager.updateTaskCount(task.date);
  }

  renderTasks(date) {
    const dateStr = date.toDateString();
    this.listContainer.innerHTML = "";
    const tasks = this.tasksByDate.get(dateStr) || [];
    tasks.forEach((task) =>
      this.listContainer.appendChild(task.createTaskElement())
    );
    this.updateTaskCount(date);
  }

  updateTaskCount(date) {
    const dateStr = date.toDateString();
    const tasks = this.tasksByDate.get(dateStr) || [];
    this.taskCounter.textContent = tasks.length;
  }

  clearTasksForDate(date) {
    const dateStr = date.toDateString();
    if (confirm("Are you sure you want to delete all tasks for this day?")) {
      this.tasksByDate.delete(dateStr);
      this.renderTasks(date);
      this.updateTaskCount(date);
    }
  }
}

const taskManager = new TaskManager();
const calendar = new Calendar(taskManager);

const inputBox = document.getElementById("input-box");
const taskModal = document.getElementById("task-modal");
const editModal = document.getElementById("task-edit");
const taskText = document.getElementById("task-text");
const taskType = document.getElementById("task-type");

inputBox.addEventListener("focus", () => {
  taskModal.classList.add("active");
  taskText.focus();
});

document.getElementById("input-button").addEventListener("click", () => {
  const text = taskText.value.trim();
  const type = taskType.value;
  if (!text) {
    alert("Add the task!");
    return;
  }
  taskManager.addTask(text, type, calendar.currentDate);
  taskManager.updateTaskCount(calendar.currentDate);
  taskModal.classList.remove("active");
  taskText.value = "";
});

taskText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const text = taskText.value.trim();
    const type = taskType.value;
    if (!text) {
      alert("Add the task!");
      return;
    }
    taskManager.addTask(text, type, calendar.currentDate);
    taskManager.updateTaskCount(calendar.currentDate);
    closeAddModal();
  }
});

document.getElementById("clean-allBtn").addEventListener("click", () => {
  taskManager.clearTasksForDate(calendar.currentDate);
});

function closeAddModal() {
  taskModal.classList.remove("active");
  taskText.value = "";
  taskType.value = "task";
}

function closeEditModal() {
  editModal.classList.remove("active");
}

document
  .getElementById("close-button")
  .addEventListener("click", closeAddModal);
