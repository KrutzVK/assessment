let dataurl = 'https://assessment-users-backend.herokuapp.com/users.json';
let userData = ""
const addUserForm = document.querySelector('.addUserForm')
const firstNameValue = document.getElementById('firstNameValue')
const lastNameValue = document.getElementById('lastNameValue')
const btnSubmit = document.querySelector('.btn');
const userList = document.querySelector('.myTable')

//get request
async function getData(dataurl) {
    let response = await fetch(dataurl);
    let data = await response.json();
    return data;
}

const table_element = document.getElementById('myTable');
const pagination_element = document.getElementById('wrapper-pagination');
var current_page = 1;
var rows = 10;

async function buildTable(wrapper, rows_per_page, page) {
    let userData = await getData(dataurl); //fetch all data
    //clear table
    wrapper.innerHTML = "";
    page--;

    //slice data
    var trimStart = rows_per_page * page;
    var trimEnd = trimStart + rows_per_page
    var trimmedData = userData.slice(trimStart, trimEnd);

    //loop through
    for (let i = 0; i < trimmedData.length; i++) {
        var userRow = `<tr data-id=${trimmedData[i].id}>
        <td class="fName">${trimmedData[i].first_name}</td>
        <td class="lName">${trimmedData[i].last_name}</td>
        <td class="created">${trimmedData[i].created_at}</td>
        <td class="status"><a href="#" id="changeStatus">${trimmedData[i].status}</a></td>
        <td data-id=${trimmedData[i].id}>
            <a href="#" id="editPost">Edit</a>
            <a href="#" id="deletePost">Delete</a>        
        </td>
                            </tr>`;

        wrapper.innerHTML += userRow
    }
}

async function pagination(wrapper, rows_per_page) {
    let userData = await getData(dataurl); //fetch all data
    wrapper.innerHTML = "";
    let pageCount = Math.ceil(userData.length / rows_per_page);

    for (let i = 1; i < pageCount + 1; i++) {
        let btn = paginationButton(i);

        wrapper.appendChild(btn);
    }
}

function paginationButton(page) {
    let button = document.createElement('button');
    button.innerText = page;
    button.setAttribute("class", "pg-btn");

    if (current_page == page) button.classList.add('active');

    button.addEventListener('click', function() {
        current_page = page;
        buildTable(table_element, rows, current_page);
    });

    return button;

}

buildTable(table_element, rows, current_page);
pagination(pagination_element, rows);
//Add new user
//Method: POST
addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch(dataurl, {
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
        .then(data => { return data })
        .catch(err => console.log(err))
        //reset form
    firstNameValue.value = '';
    lastNameValue.value = '';
});

userList.addEventListener('click', (e) => {
    e.preventDefault();
    let deletePressed = e.target.id == 'deletePost';
    let editPressed = e.target.id == 'editPost';
    let statusPressed = e.target.id == 'changeStatus';

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
        btnSubmit.innerText = "Edit User";
    }
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        fetch(modifyURL, {
                method: 'PUT',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    first_name: firstNameValue.value,
                    last_name: lastNameValue.value
                })
            })
            .then(res => { console.log(res) })
            .then(() => location.reload())
            .catch(err => console.log(err))
    })

    if (statusPressed) {
        const parent = e.target.parentNode.parentNode;
        let status = parent.querySelector('.status').textContent;
        let firstName = parent.querySelector('.fName').textContent;
        let id = parent.dataset.id;
        let dataURL = 'https://assessment-users-backend.herokuapp.com/users/'
        let statusURL = dataURL + id + ".json";

        if (status === 'active') {
            var retVal = confirm("User: " + firstName + " is Active\nDo you want to lock the user? ");
            if (retVal == true) {
                fetch(statusURL, {
                        method: 'PUT',
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify({
                            status: "locked"
                        })
                    })
                    .then(res => { console.log(res) })
                    .then(() => location.reload())
                    .catch(err => console.log(err))
            }

        } else {
            var retVal = confirm("User: " + firstName + " is Locked\nDo you want to activate the user? ");
            if (retVal == true) {
                fetch(statusURL, {
                        method: 'PUT',
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify({
                            status: "active"
                        })
                    })
                    .then(res => { console.log(res) })
                    .then(() => location.reload())
                    .catch(err => console.log(err))
            }
        }


    }
});