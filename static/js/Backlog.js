import { createElementWithClassName } from "./helpers.js"

export default class Backlog {
    constructor(taskList) {
        this.data = {
            taskList,
        };
        this.elements = {
            tasksContainer: document.querySelector("#tasks-container"),
            search: document.querySelector(".search"),
        };
        this.init();
    }

    init() {
        this.renderTasks();
        this.initSearch();
    }

    renderTasks() {
        this.data.taskList.forEach((task) => {
            if (task.executor === null) {
                this.createBacklogTask(task);
            }
        });
    }

    createBacklogTask(task) {
        const taskBlock = createElementWithClassName("div", "backlog-panel__task");
        const title = createElementWithClassName("span", "backlog-panel__task-title");
        title.textContent = task.subject;
        const content = createElementWithClassName("span", "backlog-panel__task-content");
        content.textContent = task.description;
        taskBlock.append(title);
        taskBlock.append(content);
        taskBlock.dataset.id = task.id;
        taskBlock.draggable = true;
        this.elements.tasksContainer.append(taskBlock);

        taskBlock.addEventListener("dragstart", this.drag);
        taskBlock.addEventListener("dragend", this.handleDragend.bind(this));
    }

    drag(event) {
        const id = event.target.dataset.id;
        event.dataTransfer.setData('id', id);
    }

    handleDragend(event) {
        if (event.dataTransfer.dropEffect !== "none") {
            const id = event.target.dataset.id;
            this.deleteBacklogTask(id);
        }
    }

    deleteBacklogTask(id) {
        const backlogTasks = document.querySelectorAll(".backlog-panel__task");
        for (let i = 0; i < backlogTasks.length; i++) {
            if (backlogTasks[i].dataset.id.toString() === id.toString()) {
                backlogTasks[i].remove();
                const idx = this.data.taskList.findIndex((task) => task.id === id);
                this.data.taskList.splice(idx, 1);
            }
        }
    }

    search(e) {
        e.preventDefault();
        this.elements.tasksContainer.innerHTML = '';
        this.data.taskList.forEach((task) => {
            if (task.executor === null && task.subject.toLowerCase().indexOf(this.elements.search.value.toLowerCase()) !== -1) {
                this.createBacklogTask(task);
            }
        });
    }

    initSearch() {
        const clearIcon = document.querySelector(".clear-icon");

        this.elements.search.addEventListener("keyup", () => {
            if (this.elements.search.value && clearIcon.style.visibility != "visible") {
                clearIcon.style.visibility = "visible";
            } else if (!this.elements.search.value) {
                clearIcon.style.visibility = "hidden";
            }
        });

        clearIcon.addEventListener("click", () => {
            this.elements.search.value = "";
            clearIcon.style.visibility = "hidden";
        })

        const searchRow = document.querySelector(".search-row");
        searchRow.addEventListener("submit", this.search.bind(this));
    }
}