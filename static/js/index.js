import { fetchTasksList } from "./api.js";
import Schedule from "./Schedule.js";
import Backlog from "./Backlog.js";

window.onload = async function() {
    try {
        const taskList = await fetchTasksList();

        const schedule = new Schedule([...taskList]);
        const backlog = new Backlog([...taskList]);
    } catch (e) {
        alert("Ошибка загрузки списка задач");
        console.log(e);
    }
};