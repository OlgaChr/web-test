import { fetchUsersList, fetchTasksList } from "./api.js";

const day_width = 150;
let taskList = [];

function toTimestamp(date){
    date.setHours(0,0,0,0);
    var datum = Date.parse(date);
    return datum/1000;
 }

function createElementWithClassName(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function createUserRow(userId, userName) {
    const row = createElementWithClassName("div", "tasks-panel__row user-row");
    const user = createElementWithClassName("div", "tasks-panel__user");
    user.textContent = userName;
    row.dataset.userId = userId;
    row.append(user);
    const schedule = document.querySelector("#schedule");
    schedule.append(row);

    row.addEventListener("dragover", allowDrop);
    row.addEventListener("drop", drop);
}

function allowDrop(event) {
    event.preventDefault();
}

function deleteDefaultRow() {
    const row = document.querySelector("#default-row");
    if (row) {
        row.remove();
    }
}

function getUserName(user) {
    const name = `${user.surname} ${user.firstName}`;
    return user.secondName ? `${name} ${user.secondName}` : name;
}

async function renderUsers() {
    try {
        const users = await fetchUsersList();
        deleteDefaultRow();
        users.forEach((user) => {
            createUserRow(user.id, getUserName(user))
        });
    } catch (e) {
        alert("Ошибка загрузки списка пользователей", e);
    }
}

function createBacklogTask(task) {
    const taskBlock = createElementWithClassName("div", "backlog-panel__task");
    const title = createElementWithClassName("span", "backlog-panel__task-title");
    title.textContent = task.subject;
    const content = createElementWithClassName("span", "backlog-panel__task-content");
    content.textContent = task.description;
    taskBlock.append(title);
    taskBlock.append(content);
    taskBlock.dataset.id = task.id;
    taskBlock.draggable = true;
    const container = document.querySelector("#tasks-container");
    container.append(taskBlock);

    taskBlock.addEventListener("dragstart", drag);
}

function drag(event) {
    event.dataTransfer.setData('id', event.target.dataset.id);
}

function drop(event) {
    const id = event.dataTransfer.getData('id');
    const target = event.target.closest(".user-row")
    const task = taskList.find((item) => item.id.toString() === id.toString());
    if (task) {
        createUserTask({ ...task, executor: target.dataset.userId });
        updateTaskDate();
        deleteBacklogTask(id);
    }
}

function deleteBacklogTask(id) {
    const backlogTasks = document.querySelectorAll(".backlog-panel__task");
    for (let i = 0; i < backlogTasks.length; i++) {
        if (backlogTasks[i].dataset.id.toString() === id.toString()) {
            backlogTasks[i].remove();
        }
    }
}

function updateTaskDate() {
    const days = document.querySelectorAll(".tasks-panel__day");
    const tasks = document.querySelectorAll(".tasks-panel__tasks-wrapper");
    tasks.forEach((task) => {
        const idx = Array.prototype.findIndex.call(days, (item) => item.dataset.date == task.dataset.planStartDate);
                
        if (idx >-1) {
            task.style.left = idx * day_width + 100 + "px";
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    });
    
}

function createUserTask(task) {
    const taskBlock = createElementWithClassName("div", "tasks-panel__task");
    taskBlock.textContent = task.subject;
    const tooltip = createElementWithClassName("span", "tooltip");
    tooltip.textContent = `Описание: ${task.description}\nДата создания: ${task.creationDate}\nДата начала выполнения: ${task.planStartDate}\nДата окончания выполнения: ${task.planEndDate}`;
    taskBlock.append(tooltip);
    
    const containers = document.querySelectorAll(".user-row");

    for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        if (container.dataset.userId.toString() === task.executor.toString()) {
            const existsDays = container.querySelectorAll(".tasks-panel__tasks-wrapper");
            const taskDay = Array.prototype.find.call(existsDays, (item) => item.dataset.planStartDate == toTimestamp(new Date(task.planStartDate)));
            if (taskDay) {
                taskDay.append(taskBlock);
            } else {
                const dayWrapper = createElementWithClassName("div", "tasks-panel__tasks-wrapper");
                dayWrapper.dataset.planStartDate = toTimestamp(new Date(task.planStartDate));
                dayWrapper.append(taskBlock);
                container.append(dayWrapper);
            }
            break;
        }
    }
}

async function renderTasks() {
    try {
        taskList = await fetchTasksList();
        taskList.forEach((task) => {
            if (task.executor === null) {
                createBacklogTask(task);
            } else {
                createUserTask(task);
            }
        });
        updateTaskDate();
    } catch (e) {
        alert("Ошибка загрузки списка задач", e);
    }
}

function createCalendar() {
    const container = document.querySelector("#calendar");
    let num = Math.floor((container.clientWidth - 100) / 200);
    num = Math.max(num, 7);
    for (let i = 0; i < num; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateBlock = createElementWithClassName("div", "tasks-panel__day");
        dateBlock.textContent = date.toLocaleDateString();
        dateBlock.dataset.date = toTimestamp(date);
        container.append(dateBlock);
    }
}

function shiftCalendar() {
    let days_shift = 0;
    
    return function(shift) {
        days_shift += shift;
        const days = document.querySelectorAll(".tasks-panel__day");
        days.forEach((day, idx) => {
            const date = new Date();
            date.setDate(date.getDate() + idx + days_shift);
            day.textContent = date.toLocaleDateString();
            day.dataset.date = toTimestamp(date);
        });
        updateTaskDate();
    }
}

function search(e) {
    e.preventDefault();
    const searchBar = document.querySelector(".search");
    const container = document.querySelector("#tasks-container");
    container.innerHTML = '';
    taskList.forEach((task) => {
        if (task.executor === null && task.subject.toLowerCase().indexOf(searchBar.value.toLowerCase()) !== -1) {
            createBacklogTask(task);
        }
    });
}

window.onload = async function() {
    createCalendar();
    await renderUsers();
    renderTasks();
    const prev = document.querySelector("#prev-button");
    const next = document.querySelector("#next-button");
    const shift = shiftCalendar();
    prev.addEventListener("click", () => shift(-1));
    next.addEventListener("click", () => shift(1));

    const clearIcon = document.querySelector(".clear-icon");
    const searchBar = document.querySelector(".search");

    searchBar.addEventListener("keyup", () => {
        if(searchBar.value && clearIcon.style.visibility != "visible"){
            clearIcon.style.visibility = "visible";
        } else if(!searchBar.value) {
            clearIcon.style.visibility = "hidden";
        }
    });

    clearIcon.addEventListener("click", () => {
        searchBar.value = "";
        clearIcon.style.visibility = "hidden";
    })

    const searchRow = document.querySelector(".search-row");
    searchRow.addEventListener("submit", search);
};