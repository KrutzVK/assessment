const Joi = require('joi');
const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello world!!!');
});

//GET - list of all tasks
app.get('/todos', (req, res) => {
    let fileData = fs.readFileSync('todos.json')
    let todos = JSON.parse(fileData);
    res.send(todos);
});

//POST - add new todo
app.post('/todos', (req, res) => {
    let data = req.body;

    if (!data.priority) {
        data.priority = 3;
    }
    if (!data.done) {
        data.done = false;
    }

    //validate input
    const { error } = validate(data);
    if (error) return res.status(400).send(error.details[0].message);

    //if valid push to file
    let fileData = fs.readFileSync('todos.json')
    let todos = JSON.parse(fileData);

    //Write to file
    let id = todos.length + 1
    const todo = {
        id: id.toString(),
        text: data.text,
        priority: data.priority,
        done: data.done
    };
    todos.push(todo);

    fs.writeFile('todos.json', JSON.stringify(todos, null, 2), 'utf8', (err) => {
        if (err) {
            console.log(err.message);
        }
    });

    res.send(todo);
});

//GET - find specific task data
app.get('/todos/:id', (req, res) => {
    //find todo task
    let fileData = fs.readFileSync('todos.json')
    let todos = JSON.parse(fileData);
    let todo = todos.find((todo) => todo.id === req.params.id);

    if (!todo) return res.status(404).send('The todo task with give Id was not found'); //if not found, return 404 object not found
    res.send(todo); //if found send object
});

//PUT - update todo
app.put('/todos/:id', (req, res) => {
    let fileData = fs.readFileSync('todos.json')
    let todos = JSON.parse(fileData);
    let todo = todos.find((todo) => todo.id === req.params.id);
    if (!todo) return res.status(404).send('The todo task with give Id was not found'); //if not found, return 404 object not found

    const index = todos.indexOf(todo);
    //set defualt value
    let data = req.body;
    if (!data.priority) {
        data.priority = 3;
    }
    if (!data.done) {
        data.done = false;
    }
    //validate, if error return 400 - bad request
    const { error } = validate(data); //validate input
    if (error) return res.status(400).send(error.details[0].message); //if invalid input, return 400 bad request


    //if valid input update todos, return updated
    if (todo.text != data.text) {
        todos[index].text = data.text;
    }
    if (todo.priority != data.priority) {
        todos[index].priority = data.priority
    }
    if (todo.done != data.done) {
        todos[index].done = data.done
    }

    fs.writeFile('todos.json', JSON.stringify(todos, null, 2), 'utf8', (err) => {
        if (err) {
            console.log(err.message);
            return
        }
        res.send(todo);
    });


});

//DELETE - remove todo
app.delete('/todos/:id', (req, res) => {
    let fileData = fs.readFileSync('todos.json')
    let todos = JSON.parse(fileData);
    let todo = todos.find((todo) => todo.id === req.params.id);
    if (!todo) return res.status(404).send('The todo task with give Id was not found'); //if not found, return 404 object not found

    //if found remove from array, return removed task
    const index = todos.indexOf(todo);
    if (index !== -1) {
        todos.splice(index, 1); // Remove the entry at the index
    }
    fs.writeFile('todos.json', JSON.stringify(todos, null, 2), 'utf8', (err) => {
        if (err) {
            console.log(err.message);
            return
        }
        res.send('Deleted')
    });
});

//validate input data
function validate(todo) {
    const schema = {
        text: Joi.string().alphanum().min(3).required(),
        priority: Joi.number().integer().min(1).max(5),
        done: Joi.boolean()
    }
    return Joi.validate(todo, schema);
}


//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));