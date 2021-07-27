// const BASE_URL = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script'
const BASE_URL = '/api'

async function get(url) {
    const response = await fetch(`${BASE_URL}/${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Error HTTP. Status: " + response.status);
    }
}

export async function fetchUsersList() {
    return await get('users');
}

export async function fetchTasksList() {
    return await get('tasks');
}