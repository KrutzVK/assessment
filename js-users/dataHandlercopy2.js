let dataurl = 'https://assessment-users-backend.herokuapp.com/users.json';
let userData = ""

//get request
async function getData(url) {
    let response = await fetch(url);
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
        var userRow = `<tr>
                 <td>${trimmedData[i].first_name}</td>
                 <td>${trimmedData[i].last_name}</td>
                 <td>${trimmedData[i].created_at}</td>
                 <td>${trimmedData[i].status}</td>
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
const addUserForm = document.querySelector('.addUserForm')
const firstNameValue = document.getElementById('firstNameValue')
const lastNameValue = document.getElementById('lastNameValue')


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
        .then(data => {
            const dataArray = [];
            dataArray.push(data);
            buildTable(table_element, rows, current_page);
        })
        .catch(err => console.log(err))
});