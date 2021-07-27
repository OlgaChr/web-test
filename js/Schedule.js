class Schedule {
  constructor() {
    
  }

  createUserRow(userId, userName) {
    const row = createElementWithClassName("div", "tasks-panel__row user-row");
    const user = createElementWithClassName("div", "tasks-panel__user");
    user.textContent = userName;
    row.dataset.userId = userId;
    row.append(user);
    const tasks = document.querySelector("#tasks");
    tasks.append(row);
  }
}