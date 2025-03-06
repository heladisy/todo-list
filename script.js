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
    if (this.completed) {
      taskTextElement.classList.add("done");
    }

    const editBtn = this.createButton("edit", () => {
      const newText = prompt("Edit task:", taskTextElement.textContent);
      if (newText !== null) {
        this.text = newText;
        taskTextElement.textContent = newText;
      }
    });

    const deleteBtn = this.createButton("delete", () => {
      taskItem.remove();
      TaskManager.removeTask(this);
    });

    const typeIcon = document.createElement("span");
    typeIcon.textContent = this.type === "habit" ? "🌱" : "📌";

    taskItem.append(
      taskCheckbox,
      typeIcon,
      editBtn,
      deleteBtn,
      taskTextElement
    );
    return taskItem;
  }

  createButton(type, handler) {
    const btn = document.createElement("button");
    btn.innerHTML =
      type === "edit"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.7088 2.63126C18.0988 3.02127 18.0988 3.65127 17.7088 4.04127L15.8788 5.87126L12.1288 2.12126L13.9588 0.291265C14.1456 0.104012 14.3993 -0.0012207 14.6638 -0.0012207C14.9283 -0.0012207 15.1819 0.104012 15.3688 0.291265L17.7088 2.63126ZM-0.0012207 17.5013V14.4613C-0.0012207 14.3213 0.0487793 14.2013 0.148779 14.1013L11.0588 3.19126L14.8088 6.94127L3.88878 17.8513C3.79878 17.9513 3.66878 18.0013 3.53878 18.0013H0.498779C0.218779 18.0013 -0.0012207 17.7813 -0.0012207 17.5013Z" fill="#828282"/>
      </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M13.3 0.709956C13.1131 0.522704 12.8595 0.417471 12.595 0.417471C12.3305 0.417471 12.0768 0.522704 11.89 0.709956L6.99997 5.58996L2.10997 0.699956C1.92314 0.512704 1.66949 0.407471 1.40497 0.407471C1.14045 0.407471 0.886802 0.512704 0.699971 0.699956C0.309971 1.08996 0.309971 1.71996 0.699971 2.10996L5.58997 6.99996L0.699971 11.89C0.309971 12.28 0.309971 12.91 0.699971 13.3C1.08997 13.69 1.71997 13.69 2.10997 13.3L6.99997 8.40996L11.89 13.3C12.28 13.69 12.91 13.69 13.3 13.3C13.69 12.91 13.69 12.28 13.3 11.89L8.40997 6.99996L13.3 2.10996C13.68 1.72996 13.68 1.08996 13.3 0.709956Z" fill="black"/>
      </svg>`;
    btn.classList.add(`${type}-btn`);
    btn.addEventListener("click", handler);
    return btn;
  }
}

const TaskManager = {
  tasks: new Map(),

  addTask(task) {
    const dateStr = task.date.toDateString();
    if (!this.tasks.has(dateStr)) {
      this.tasks.set(dateStr, []);
    }
    this.tasks.get(dateStr).push(task);
    this.renderTasks(task.date);
  },

  removeTask(task) {
    const dateStr = task.date.toDateString();
    const tasks = this.tasks.get(dateStr);
    if (tasks) {
      const index = tasks.indexOf(task);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    }
  },

  getTasksForDate(date) {
    return this.tasks.get(date.toDateString()) || [];
  },

  renderTasks(date) {
    const listContainer = document.getElementById("list-container");
    listContainer.innerHTML = "";
    const tasks = this.getTasksForDate(date);
    tasks.forEach((task) => {
      listContainer.appendChild(task.createTaskElement());
    });
  },

  clearAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
      this.tasks.clear();
      document.getElementById("list-container").innerHTML = "";
    }
  },
};

document.getElementById("input-box").addEventListener("focus", () => {
  document.getElementById("task-modal").classList.add("active");
});

document.addEventListener("click", (event) => {
  const modal = document.getElementById("task-modal");
  if (event.target === modal) {
    closeModal();
  }
});

function closeModal() {
  document.getElementById("task-modal").classList.remove("active");
  document.getElementById("task-text").value = "";
}

document.getElementById("input-button").addEventListener("click", () => {
  const taskText = document.getElementById("task-text").value.trim();
  const taskType = document.getElementById("task-type").value;

  if (taskText === "") return alert("Add the task!");

  const task = new Task(taskText, taskType, currentDate);
  TaskManager.addTask(task);
  closeModal();
});

document.getElementById("clean-allBtn").addEventListener("click", () => {
  TaskManager.clearAllTasks();
});

// Update selected date and render tasks
function updateSelectedDate(date) {
  currentDate = new Date(date);
  renderCalendar();
  TaskManager.renderTasks(currentDate);
}
