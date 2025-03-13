const calendar = document.getElementById("calendar");
const selectedDateElement = document.getElementById("selected-date");
const tasks = document.getElementById("tasks");
let currentDate = new Date();

function getFormattedDate(date) {
  return date.toLocaleDateString("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderCalendar() {
  calendar.innerHTML = "";
  for (let i = -3; i <= 3; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);

    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    if (i === 0) dayElement.classList.add("active");

    const weekday = document.createElement("p");
    weekday.classList.add("weekday");
    weekday.textContent = date.toLocaleDateString("en", { weekday: "short" });

    const day = document.createElement("p");
    day.classList.add("date");
    day.textContent = date.getDate();

    dayElement.appendChild(weekday);
    dayElement.appendChild(day);
    dayElement.addEventListener("click", () => updateSelectedDate(date));

    calendar.appendChild(dayElement);
  }
}
function updateSelectedDate(date) {
  currentDate = new Date(date);
  selectedDateElement.textContent = getFormattedDate(currentDate);
  renderCalendar();
  updateTasks();
}

function updateTasks() {
  tasks.innerHTML = currentDate.getDate() === new Date().getDate();
  updateSelectedDate(currentDate);
}

document
  .getElementById("today-btn")
  .addEventListener("click", () => updateSelectedDate(new Date()));




  