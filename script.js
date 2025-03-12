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
      TaskManager.editTask(this, taskItem)
    );
    const deleteBtn = this.createButton("delete", () =>
      TaskManager.removeTask(this, taskItem)
    );

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

    saveBtn.onclick = () => {
      const newText = editInput.value.trim();
      if (newText) {
        this.text = newText;
        taskTextElement.textContent = newText;
        closeEditModal();
      }
    };
  }

  createButton(type, handler) {
    const btn = document.createElement("button");
    btn.innerHTML = type === "edit" ? this.getEditIcon() : this.getDeleteIcon();
    btn.classList.add(`${type}-btn`);
    btn.addEventListener("click", handler);
    return btn;
  }

  getEditIcon() {
    return `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.7088 5.63126C21.0988 6.02127 21.0988 6.65127 20.7088 7.04127L18.8788 8.87126L15.1288 5.12126L16.9588 3.29126C17.1456 3.10401 17.3993 2.99878 17.6638 2.99878C17.9283 2.99878 18.1819 3.10401 18.3688 3.29126L20.7088 5.63126ZM2.99878 20.5013V17.4613C2.99878 17.3213 3.04878 17.2013 3.14878 17.1013L14.0588 6.19126L17.8088 9.94127L6.88878 20.8513C6.79878 20.9513 6.66878 21.0013 6.53878 21.0013H3.49878C3.21878 21.0013 2.99878 20.7813 2.99878 20.5013Z" fill="#828282"/>
</svg>

    `;
  }

  getDeleteIcon() {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.3 5.70996C18.1131 5.5227 17.8595 5.41747 17.595 5.41747C17.3305 5.41747 17.0768 5.5227 16.89 5.70996L12 10.59L7.10997 5.69996C6.92314 5.5127 6.66949 5.40747 6.40497 5.40747C6.14045 5.40747 5.8868 5.5127 5.69997 5.69996C5.30997 6.08996 5.30997 6.71996 5.69997 7.10996L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10996C18.68 6.72996 18.68 6.08996 18.3 5.70996Z" fill="black"/>
</svg>
`;
  }
}

const TaskManager = {
  tasks: new Map(),

  addTask(task) {
    const dateStr = task.date.toDateString();
    if (!this.tasks.has(dateStr)) this.tasks.set(dateStr, []);
    this.tasks.get(dateStr).push(task);
    this.renderTasks(task.date);
  },

  editTask(task, taskElement) {
    task.openEditModal(taskElement);
  },
  removeTask(task, taskElement) {
    const dateStr = task.date.toDateString();
    const tasks = this.tasks.get(dateStr);
    if (tasks) {
      const index = tasks.indexOf(task);
      if (index > -1) tasks.splice(index, 1);
    }
    taskElement.remove();
  },
  renderTasks(date) {
    const listContainer = document.getElementById("list-container");
    listContainer.innerHTML = "";
    const tasks = this.tasks.get(date.toDateString()) || [];
    tasks.forEach((task) =>
      listContainer.appendChild(task.createTaskElement())
    );
  },

  clearAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
      this.tasks.clear();
      document.getElementById("list-container").innerHTML = "";
    }
  },
};

const inputBox = document.getElementById("input-box");
const taskModal = document.getElementById("task-modal");
const editModal = document.getElementById("task-edit");

inputBox.addEventListener("focus", () => taskModal.classList.add("active"));



document.getElementById("input-button").addEventListener("click", () => {
  const taskText = document.getElementById("task-text").value.trim();
  const taskType = document.getElementById("task-type").value;
  if (!taskText) return alert("Add the task!");

  TaskManager.addTask(new Task(taskText, taskType, currentDate));
  closeAddModal();
});

document
  .getElementById("clean-allBtn")
  .addEventListener("click", () => TaskManager.clearAllTasks());

function closeAddModal() {
  taskModal.classList.remove("active");
}
function closeEditModal() {
  editModal.classList.remove("active");
}
