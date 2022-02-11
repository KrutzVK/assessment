const url = 'https://assessment-users-backend.herokuapp.com/users.json';

fetch(url).then((response) => {
    return response.json();
}).then((data) => {
    buildTable(data);
}).catch(function(error) {
    console.log("error retrieveing data");
});


function buildTable(data) {
    var table = document.getElementById('myTable');

    for (var i = 0; i < data.length; i++) {
        var row = `<tr>
            <td>${data[i].first_name}</td>
            <td>${data[i].last_name}</td>
            <td>${data[i].created_at}</td>
                        </tr>`;
        table.innerHTML += row;

    }
}