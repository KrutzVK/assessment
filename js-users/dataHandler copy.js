async function getUsers() {
    let url = 'https://assessment-users-backend.herokuapp.com/users.json';
    try {

        let response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

async function displayUsers() {
    let users = await getUsers();
    let html = '';
    users.forEach(user => {
        let htmlSegment = `<table class="users">
                                <tr>
                                <td> ${user.first_name} </td>
                                <td> ${user.last_name} </td>
                                <td> ${user.created_at} </td>
                                </tr>
                            </table>`;

        html += htmlSegment;
    });

    let container = document.querySelector('.container');
    container.innerHTML = html;
}

displayUsers();