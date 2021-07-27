import { createElementWithClassName, toTimestamp } from "./helpers.js"
import { fetchUsersList } from "./api.js";

export default class Schedule {
    constructor(taskList) {
        this.data = {
            dayWidth: 150,
            taskList,
            users: [],
        };
        this.elements = {
            days: [],
            calendar: document.querySelector("#calendar"),
            schedule: document.querySelector("#schedule"),
        };
        this.init();
    }

    async init() {
        this.createCalendar();
        await this.renderUsers();
        this.renderTasks();
        if (this.data.users.length) {
            this.showTabs();
        }

        const prev = document.querySelector("#prev-button");
        const next = document.querySelector("#next-button");
        const shift = this.shiftCalendar();
        prev.addEventListener("click", () => shift(-1));
        next.addEventListener("click", () => shift(1));

        window.addEventListener("resize", () => {
            this.createCalendar(this.elements.days.item(0).dataset.date);
            this.renderTasks();
            this.updateCoordsTodayTab();
        });

        this.elements.schedule.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.deltaY > 0 ? shift(1) : shift(-1);
        });
    }

    createCalendar(start = null) {
        this.elements.calendar.innerHTML = "";
        // количество отображаемых дней
        let num = Math.floor((this.elements.calendar.clientWidth - 100) / this.data.dayWidth);
        num = Math.max(num, 7);
        for (let i = 0; i < num; i++) {
            const date = start ? new Date(start * 1000) : new Date();
            date.setDate(date.getDate() + i);
            const dateBlock = createElementWithClassName("div", "tasks-panel__day");
            dateBlock.textContent = date.toLocaleDateString();
            dateBlock.dataset.date = toTimestamp(date);
            this.elements.calendar.append(dateBlock);
        }
        this.elements.days = document.querySelectorAll(".tasks-panel__day");
    }

    shiftCalendar() {
        let days_shift = 0;

        return function(shift) {
            days_shift += shift;
            // обновление дат в календаре
            this.elements.days.forEach((day, idx) => {
                const date = new Date();
                date.setDate(date.getDate() + idx + days_shift);
                day.textContent = date.toLocaleDateString();
                day.dataset.date = toTimestamp(date);
            });
            // сдвиг задач и табов
            this.shiftTasks(shift);
            this.updateCoordsTodayTab();
        }.bind(this);
    }

    setDefaultRow() {
        const row = document.querySelector("#default-row");
        if (row) {
            row.textContent = "Нет данных";
        } else {
            const defaultRow = createElementWithClassName("div", "tasks-panel__row user-row");
            defaultRow.textContent = "Нет данных";
            defaultRow.id = "default-row";
            this.elements.schedule.append(defaultRow);
        }
    }

    deleteDefaultRow() {
        const row = document.querySelector("#default-row");
        if (row) {
            row.remove();
        }
    }

    setLoading() {
        const row = document.querySelector("#default-row");
        if (row) {
            row.textContent = "Загрузка...";
        }
    }

    getUserName(user) {
        const name = `${user.surname} ${user.firstName}`;
        return user.secondName ? `${name} ${user.secondName}` : name;
    }

    async renderUsers() {
        try {
            this.setLoading();
            this.data.users = await fetchUsersList();
            if (this.data.users.length) {
                this.deleteDefaultRow();
                this.data.users.forEach((user) => {
                    this.createUserRow(user.id, this.getUserName(user))
                });
            }
        } catch (e) {
            this.setDefaultRow();
            alert("Ошибка загрузки списка пользователей");
            console.log(e);
        }
    }

    createUserRow(userId, userName) {
        const row = createElementWithClassName("div", "tasks-panel__row user-row");
        const user = createElementWithClassName("div", "tasks-panel__user");
        user.textContent = userName;
        row.dataset.userId = userId;
        row.append(user);
        this.elements.schedule.append(row);

        // обработчики перетаскивания таска из бэклога
        row.addEventListener("dragover", this.allowDrop);
        row.addEventListener("drop", this.drop.bind(this));
    }

    allowDrop(event) {
        event.preventDefault();
    }

    drop(event) {
        const id = event.dataTransfer.getData('id');
        const target = event.target.closest(".user-row")
        const taskIdx = this.data.taskList.findIndex((item) => item.id.toString() === id.toString());
        if (taskIdx > -1) {
            this.data.taskList[taskIdx] = {...this.data.taskList[taskIdx], executor: target.dataset.userId };
            this.createUserTask(this.data.taskList[taskIdx]);
        }
    }

    showTabs() {
        // изменение высоты линии по высоте диаграммы 
        const lines = document.querySelectorAll(".tasks-panel__tab-line");
        if (this.elements.calendar && this.elements.schedule) {
            const scheduleHeight = this.elements.calendar.clientHeight + this.elements.schedule.clientHeight;
            lines.forEach((line) => {
                line.style.height = scheduleHeight + 'px';
            })
        };
        // перемещение таба к сегодняшней дате
        this.updateCoordsTodayTab();
    }

    updateCoordsTodayTab() {
        const todayTab = document.querySelector(".tasks-panel__tab.tab-today");
        const today = Array.prototype.find.call(this.elements.days, (item) => item.dataset.date == toTimestamp(new Date()));
        if (today) {
            todayTab.style.visibility = "visible";
            todayTab.style.left = today.getBoundingClientRect().left - todayTab.clientWidth / 2 + "px";
        } else {
            todayTab.style.visibility = "hidden";
        }
    }

    renderTasks() {
        const tasks = document.querySelectorAll(".tasks-panel__tasks-wrapper");
        tasks.forEach((task) => {
            task.remove()
        });
        const start = this.elements.days.item(0).dataset.date;
        const end = this.elements.days.item(this.elements.days.length - 1).dataset.date;
        this.data.taskList.forEach((task) => {
            if (task.executor !== null && (toTimestamp(new Date(task.planEndDate)) >= start || toTimestamp(new Date(task.planStartDate)) <= end)) {
                this.createUserTask(task);
            }
        });
    }

    renderOneDay(day) {
        this.data.taskList.forEach((task) => {
            if (task.executor !== null && toTimestamp(new Date(task.planStartDate)) <= day && toTimestamp(new Date(task.planEndDate)) >= day) {
                this.createUserTask(task, new Date(day * 1000));
            }
        });
    }

    shiftTasks(shift) {
        const tasks = document.querySelectorAll(".tasks-panel__tasks-wrapper");
        const firstDay = this.elements.days.item(0).dataset.date;
        const lastDay = this.elements.days.item(this.elements.days.length - 1).dataset.date;
        // сдвиг тасков, удаление вышедших за диапазон дат
        tasks.forEach((task) => {
            if (task.dataset.date < firstDay || task.dataset.date > lastDay) {
                task.remove();
            } else {
                task.style.left = task.getBoundingClientRect().left + this.data.dayWidth * shift * -1 + "px";
            }
        });
        // создание тасков для добавившейся даты
        if (shift < 0) {
            this.renderOneDay(firstDay);
        } else {
            this.renderOneDay(lastDay);
        }
    }

    calculateTaskCoords(task) {
        const idx = Array.prototype.findIndex.call(this.elements.days, (item) => item.dataset.date == task.dataset.date);

        if (idx > -1) {
            return task.style.left = idx * this.data.dayWidth + 100 + "px";
        } else {
            return null;
        }
    }

    createUserTask(task, day = null) {
        const taskBlock = createElementWithClassName("div", "tasks-panel__task");
        taskBlock.textContent = task.subject;
        const tooltip = createElementWithClassName("span", "tooltip");
        tooltip.textContent = `Описание: ${task.description}\nДата создания: ${task.creationDate}\nДата начала выполнения: ${task.planStartDate}\nДата окончания выполнения: ${task.planEndDate}`;
        taskBlock.append(tooltip);

        // пользователи
        const containers = document.querySelectorAll(".user-row:not(#default-row)");

        for (let i = 0; i < containers.length; i++) {
            const container = containers[i];
            // найден исполнитель задачи
            if (container.dataset.userId.toString() === task.executor.toString()) {
                // уже созданные таски  
                const existsDays = container.querySelectorAll(".tasks-panel__tasks-wrapper");

                // возможность создания задачи для конкретного дня
                const startDay = day ? new Date(day.getTime()) : new Date(task.planStartDate);
                const endDay = day ? new Date(day.getTime()) : new Date(task.planEndDate);
                // создание записей о задаче на период ее выполнения
                for (let currentDay = startDay; currentDay <= endDay;) {
                    const taskDay = Array.prototype.find.call(
                        existsDays,
                        (item) => item.dataset.date == toTimestamp(currentDay)
                    );
                    // для данного дня уже создан другой таск
                    if (taskDay) {
                        taskDay.append(taskBlock.cloneNode(true));
                    } else {
                        const dayWrapper = createElementWithClassName("div", "tasks-panel__tasks-wrapper");
                        dayWrapper.dataset.date = toTimestamp(currentDay);
                        dayWrapper.append(taskBlock.cloneNode(true));
                        const left = this.calculateTaskCoords(dayWrapper);
                        if (left) {
                            dayWrapper.style.left = left;
                            container.append(dayWrapper);
                        }
                    }

                    currentDay.setDate(currentDay.getDate() + 1);
                }

                break;
            }
        }
    }
}