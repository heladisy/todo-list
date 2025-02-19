document.getElementById("input-box").addEventListener("focus", function () {
  document.getElementById("task-modal").classList.add("active");
});

window.addEventListener("click", function (event) {
  let modal = document.getElementById("task-modal");
  if (event.target === modal) {
    closeModal();
  }
});

function closeModal() {
  document.getElementById("task-modal").classList.remove("active");
  document.getElementById("task-text").value = "";
}
document.getElementById("input-button").addEventListener("click", function () {
  let taskText = document.getElementById("task-text").value.trim();
  let taskType = document.getElementById("task-type").value;

  if (taskText === "") return alert("Add the task!");

  let taskItem = document.createElement("li");
  taskItem.className = "task-item " + taskType;

  let taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.addEventListener("change", function () {
    taskTextElement.classList.toggle("done", taskCheckbox.checked);
  });

  let taskTextElement = document.createElement("span");
  taskTextElement.textContent = taskText;

  let editBtn = document.createElement("button");
  editBtn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.7088 2.63126C18.0988 3.02127 18.0988 3.65127 17.7088 4.04127L15.8788 5.87126L12.1288 2.12126L13.9588 0.291265C14.1456 0.104012 14.3993 -0.0012207 14.6638 -0.0012207C14.9283 -0.0012207 15.1819 0.104012 15.3688 0.291265L17.7088 2.63126ZM-0.0012207 17.5013V14.4613C-0.0012207 14.3213 0.0487793 14.2013 0.148779 14.1013L11.0588 3.19126L14.8088 6.94127L3.88878 17.8513C3.79878 17.9513 3.66878 18.0013 3.53878 18.0013H0.498779C0.218779 18.0013 -0.0012207 17.7813 -0.0012207 17.5013Z" fill="#828282"/>
</svg>
  `;
  editBtn.classList.add("edit-btn");

  editBtn.addEventListener("click", function () {
    let newText = prompt("Редагувати завдання:", taskTextElement.textContent);
    if (newText !== null) taskTextElement.textContent = newText;
  });

  let deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
<path d="M13.3 0.709956C13.1131 0.522704 12.8595 0.417471 12.595 0.417471C12.3305 0.417471 12.0768 0.522704 11.89 0.709956L6.99997 5.58996L2.10997 0.699956C1.92314 0.512704 1.66949 0.407471 1.40497 0.407471C1.14045 0.407471 0.886802 0.512704 0.699971 0.699956C0.309971 1.08996 0.309971 1.71996 0.699971 2.10996L5.58997 6.99996L0.699971 11.89C0.309971 12.28 0.309971 12.91 0.699971 13.3C1.08997 13.69 1.71997 13.69 2.10997 13.3L6.99997 8.40996L11.89 13.3C12.28 13.69 12.91 13.69 13.3 13.3C13.69 12.91 13.69 12.28 13.3 11.89L8.40997 6.99996L13.3 2.10996C13.68 1.72996 13.68 1.08996 13.3 0.709956Z" fill="black"/>
</svg>
  `;
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", function () {
    taskItem.remove();
  });

  let typeIcon = document.createElement("span");
  typeIcon.textContent = taskType === "habit" ? "🌱" : "📌";

  taskItem.appendChild(taskCheckbox);
  taskItem.appendChild(typeIcon);
  taskItem.appendChild(editBtn);
  taskItem.appendChild(deleteBtn);
  taskItem.appendChild(taskTextElement);

  document.getElementById("list-container").appendChild(taskItem);

  document.getElementById("task-text").value = "";
  closeModal();
});

document.getElementById("clean-allBtn").addEventListener("click", function () {
  let taskList = document.getElementById("list-container");

  let confirmDelete = confirm("Ви впевнені, що хочете видалити всі завдання?");
  if (confirmDelete) {
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
  }
});

