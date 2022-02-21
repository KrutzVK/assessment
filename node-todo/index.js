let tbody = document.getElementById('tbody')
let priorityclass = ""
let donestatus = ""
let img = ""



//fetch data
fetch("http://localhost:3000/todos")
    .then(res => res.json())
    .then(json => {
        json.map(data => {
            tbody.append(td_fun(data.text, data.done, data.priority));
        })
    })




// create data
function td_fun(text, done, priority) {
    let td = document.createElement('tr');
    if (done == true) {
        donestatus = `<a href="#" onclick="mark()">Mark as done</a>`;
        img = "correct.png"
    } else {
        donestatus = "Done";
        img = "to-do.png"
    }
    if (priority <= 2) {
        priorityclass = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800";
    } else if (priority == 3) {
        priorityclass = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800";
    } else if (priority > 3) {
        priorityclass = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800";
    }

    td.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
                <img src="${img}" class="h-10 w-10 rounded-full" alt="">
            </div>
            <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                    ${text}
                </div>
                <div class="text-sm text-gray-500">
                    ${donestatus}
                </div>
            </div>
        </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
        <span id="priorityId" class="${priorityclass}">
            ${priority}
        </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
        <span class="text-sm text-gray-500">${donestatus}</span>
    </td>
    `;

    return td;
}

function mark(e) {
    console.log(e.target);
}