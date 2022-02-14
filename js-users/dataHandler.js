const userList = document.querySelector('.myTable')
const url = 'https://assessment-users-backend.herokuapp.com/users.json'
let output = ''
const addUserForm = document.querySelector('.addUserForm')
const firstNameValue = document.getElementById('firstNameValue')
const lastNameValue = document.getElementById('lastNameValue')
const btnSubmit = document.querySelector('.btn');



const renderUsers = (users) => {
    users.forEach(user => {
        output += `<tr data-id=${user.id}>
        <td class="fName">${user.first_name}</td>
        <td class="lName">${user.last_name}</td>
        <td class="created">${user.created_at}</td>
        <td class="status">${user.status}</td>
        <td data-id=${user.id}>
            <a href="#" id="editPost">Edit</a>
            <a href="#" id="deletePost">Delete</a>        
        </td>
                   </tr>`;
    });
    userList.innerHTML = output;
}

//Load user data
//Method: GET
fetch(url)
    .then(res => res.json())
    .then(data => renderUsers(data))

userList.addEventListener('click', (e) => {
    e.preventDefault();
    let deletePressed = e.target.id == 'deletePost';
    let editPressed = e.target.id == 'editPost';

    let id = e.target.parentElement.dataset.id;
    let dataURL = 'https://assessment-users-backend.herokuapp.com/users/'
    let modifyURL = dataURL + id + ".json";

    //Delete user
    //Method: DELETE
    if (deletePressed) {
        fetch(modifyURL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(res => { console.log(res) })
            .then(() => location.reload())
            .catch(error => console.log(error))

    }

    //Edit user
    //Method: PATCH
    if (editPressed) {
        const parent = e.target.parentNode.parentNode;
        let firstName = parent.querySelector('.fName').textContent;
        let lastName = parent.querySelector('.lName').textContent;

        firstNameValue.value = firstName;
        lastNameValue.value = lastName;
    }
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        fetch(modifyURL, {
                method: 'PUT',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    first_name: firstNameValue.value,
                    last_name: lastNameValue.value,
                    status: "active"
                })
            })
            .then(res => { console.log(res) })
            .then(() => location.reload())
            .catch(err => console.log(err))
    })
});

//Add new user
//Method: POST
addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstNameValue.value,
                last_name: lastNameValue.value,
                status: "active"
            })
        })
        .then(response => response.json())
        .then(data => {
            const dataArray = [];
            dataArray.push(data);
            renderUsers(dataArray);
        })
        .catch(err => console.log(err))
        //reset form
    firstNameValue.value = '';
    lastNameValue.value = '';

});