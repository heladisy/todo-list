class Calendar {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.calendar = document.getElementById("calendar");
    this.selectedDateElement = document.getElementById("selected-date");
    this.currentDate = new Date();
    this.today = new Date();
    this.renderCalendar();
    this.updateSelectedDate(this.today); 
  }

  getFormattedDate(date) {
    return date.toLocaleDateString("en", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  renderCalendar() {
    if (!this.calendar) return;
    this.calendar.innerHTML = "";
    for (let i = -3; i <= 3; i++) {
      const date = new Date(this.currentDate);
      date.setDate(date.getDate() + i);

      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      if (date.toDateString() === this.today.toDateString())
        dayElement.classList.add("today");
      if (i === 0) dayElement.classList.add("active");

      const weekday = document.createElement("p");
      weekday.classList.add("weekday");
      weekday.textContent = date.toLocaleDateString("en", { weekday: "short" });

      const day = document.createElement("p");
      day.classList.add("date");
      day.textContent = date.getDate();

      dayElement.appendChild(weekday);
      dayElement.appendChild(day);
      dayElement.addEventListener("click", () => this.updateSelectedDate(date));

      this.calendar.appendChild(dayElement);
    }
  }

  updateSelectedDate(date) {
    this.currentDate = new Date(date);
    this.selectedDateElement.textContent = this.getFormattedDate(this.today); 
    this.renderCalendar();
    this.taskManager.renderTasks(this.currentDate);
  }
}

function updateTasks() {
  tasks.innerHTML = currentDate.getDate() === new Date().getDate();
  updateSelectedDate(currentDate);
}

document.getElementById("today-btn").addEventListener("click", () => {
  calendar.updateSelectedDate(new Date());
});


  
