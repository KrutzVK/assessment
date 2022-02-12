let dataurl = 'https://assessment-users-backend.herokuapp.com/users.json';
let userData = ""
async function getData(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

var page = 1
var rows = 10

function pagination(userData, page, rows) {

    // console.log(userData);
    var trimStart = (page - 1) * rows
    var trimEnd = trimStart + rows

    var trimmedData = userData.slice(trimStart, trimEnd)

    var pages = Math.ceil(userData.length / rows)

    return {
        'userData': trimmedData,
        'pages': pages
    }
}

function pageButtons(pages) {
    var wrapper = document.getElementById('wrapper-pagination')
    wrapper.innerHTML = ''

    for (var page = 1; page <= pages; page++) {
        wrapper.innerHTML += `<button value=${page} class="page">${page}</button>`
    }

    const btn = document.querySelector('.page');
    btn.addEventListener('click', function(event) {

    });
}
async function buildTable() {
    let userData = await getData(dataurl);
    var table = document.getElementById('myTable');

    var data = pagination(userData, page, rows)
    console.log(data);

    list = data.userData

    for (var i = 0; i < list.length; i++) {
        var row = `<tr>
            <td>${list[i].first_name}</td>
            <td>${list[i].last_name}</td>
            <td>${list[i].created_at}</td>
                        </tr>`;
        table.innerHTML += row;
    }
    pageButtons(data.pages);
}

buildTable();