import { fetchUsersList, fetchTasksList } from "./api.js"

const day_width = 200;

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
    const tasks = document.getElementById("tasks");
    tasks.append(row);
}

function deleteDefaultRow() {
    const row = document.getElementById("default-row");
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
    } catch {
        alert("Ошибка загрузки данных");
    }
}

function createBacklogTask(task) {
    const taskBlock = createElementWithClassName("div", "backlog-panel__task");
    taskBlock.textContent = task.subject;
    const container = document.getElementById("tasks-container");
    container.append(taskBlock);
}

function createUserTask(task) {
    const taskBlock = createElementWithClassName("div", "tasks-panel__task");
    taskBlock.textContent = task.subject;
    const containers = document.querySelectorAll(".user-row");
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        if (container.dataset.userId.toString() === task.executor.toString()) {
            container.append(taskBlock);
            break;
        }
    }
}

async function renderTasks() {
    try {
        const tasks = await fetchTasksList();
        tasks.forEach((task) => {
            if (task.executor === null) {
                createBacklogTask(task);
            } else {
                createUserTask(task);
            }
        });
    } catch {
        alert("Ошибка загрузки данных");
    }
}

function createCalendar() {
    const container = document.getElementById("calendar");
    let num = Math.floor((container.clientWidth - 100) / 200);
    num = Math.max(num, 7);
    for (let i = 0; i < num; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateBlock = createElementWithClassName("div", "tasks-panel__day");
        dateBlock.textContent = date.toLocaleDateString();
        container.append(dateBlock);
    }
}

window.onload = async function() {
    createCalendar();
    await renderUsers();
    renderTasks();
};