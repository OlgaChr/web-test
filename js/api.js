const BASE_URL = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script'

async function get(url) {
    fetch(`${BASE_URL}/${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then((response) => {
        console.log('response', response);
    });


    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Error HTTP. Status: " + response.status);
    }
}

export async function fetchUsersList() {
    // const response = await get('users');
    // console.log('response', response);
    // return response;
    const list = [{ "id": 1, "username": "user1", "surname": "Петров", "firstName": "Иван", "secondName": "" }, { "id": 2, "username": "user2", "surname": "Иванов", "firstName": "Пётр", "secondName": "" }, { "id": 3, "username": "user3", "surname": "Васильев", "firstName": "Артём", "secondName": "" }, { "id": 4, "username": "user4", "surname": "Кузнецов", "firstName": "Сергей", "secondName": "" }, { "id": 5, "username": "user5", "surname": "Некрасов", "firstName": "Артём", "secondName": "" }];
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 0, list);
    });
}

export async function fetchTasksList() {
    // const response = await get('users');
    // console.log('response', response);
    // return response;
    const list = [{"id":"0b996b32-3635-4a36-907f-4004d5f3217e","subject":"Анализ","description":"","creationAuthor":1,"executor":1,"creationDate":"2021-07-24","planStartDate":"2021-07-26","planEndDate":"2021-07-27","endDate":"2021-07-24","status":1,"order":1},{"id":"5d24874b-8dc9-4958-850c-03fd6f6fffd5","subject":"Планирование","description":"","creationAuthor":1,"executor":1,"creationDate":"2021-07-24","planStartDate":"2021-07-26","planEndDate":"2021-07-27","endDate":"2021-07-24","status":1,"order":1},{"id":"b7a8982a-dcf6-468f-b683-3fd1b24df151","subject":"Проектирование","description":"","creationAuthor":1,"executor":2,"creationDate":"2021-07-24","planStartDate":"2021-07-29","planEndDate":"2021-07-28","endDate":"2021-07-24","status":1,"order":1},{"id":"e46e1032-ea61-4080-a8f3-5d9a0dc80443","subject":"Разработка","description":"","creationAuthor":1,"executor":3,"creationDate":"2021-07-24","planStartDate":"2021-07-27","planEndDate":"2021-07-30","endDate":"2021-07-24","status":1,"order":1},{"id":"75a440f9-160b-452d-ab98-972be3d04d90","subject":"Тестирование","description":"","creationAuthor":1,"executor":null,"creationDate":"2021-07-24","planStartDate":"2021-07-29","planEndDate":"2021-07-30","endDate":"2021-07-24","status":1,"order":1}];
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 0, list);
    });
}