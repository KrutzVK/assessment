const userList = document.querySelector('.myTable')
const url = 'https://assessment-users-backend.herokuapp.com/users.json'
let output = ''
const addUserForm = document.querySelector('.addUserForm')
const firstNameValue = document.getElementById('firstNameValue')
const lastNameValue = document.getElementById('lastNameValue')



const renderUsers = (users) => {
    users.forEach(user => {
        output += `<tr>
        <td>${user.first_name}</td>
        <td>${user.last_name}</td>
        <td>${user.created_at}</td>
        <td>${user.status}</td>
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
            })
            .then(res => { console.log(res) })
            .then(() => console.log('done')) //location.reload())
            .catch(error => console.log(error))
    }
})

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
});