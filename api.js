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
    const list = [{ "id": "b55e3b98-1851-4f1a-9bd6-be8e77fcd900", "subject": "Анализ", "description": "", "creationAuthor": 1, "executor": 1, "creationDate": "2021-07-23", "planStartDate": "2021-07-23", "planEndDate": "2021-07-27", "endDate": "2021-07-23", "status": 1, "order": 1 }, { "id": "8aefa55d-6422-4d19-9cec-4ba69b25f1da", "subject": "Планирование", "description": "", "creationAuthor": 1, "executor": 1, "creationDate": "2021-07-23", "planStartDate": "2021-07-26", "planEndDate": "2021-07-27", "endDate": "2021-07-23", "status": 1, "order": 1 }, { "id": "1619b8b6-8fb1-42a8-88a4-7e6f4d9c1794", "subject": "Проектирование", "description": "", "creationAuthor": 1, "executor": 2, "creationDate": "2021-07-23", "planStartDate": "2021-07-27", "planEndDate": "2021-07-28", "endDate": "2021-07-23", "status": 1, "order": 1 }, { "id": "3bb689db-8d6c-4eae-9a07-c417812f93e4", "subject": "Разработка", "description": "", "creationAuthor": 1, "executor": 3, "creationDate": "2021-07-23", "planStartDate": "2021-07-27", "planEndDate": "2021-07-30", "endDate": "2021-07-23", "status": 1, "order": 1 }, { "id": "c711aa9b-bee7-45ec-adf0-254fc3177927", "subject": "Тестирование", "description": "", "creationAuthor": 1, "executor": null, "creationDate": "2021-07-23", "planStartDate": "2021-07-29", "planEndDate": "2021-07-30", "endDate": "2021-07-23", "status": 1, "order": 1 }];
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 0, list);
    });
}