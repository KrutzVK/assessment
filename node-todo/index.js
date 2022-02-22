const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

const todos = [{
        "id": "2",
        "text": "Edit users on system",
        "priority": 3,
        "done": true
    },
    {
        "id": "3",
        "text": "Delete users from system",
        "priority": 1,
        "done": false
    },
    {
        "text": "Post users on system - updated",
        "priority": 4,
        "done": true,
        "id": "fDUHgcU"
    }
];

app.get('/', (req, res) => {
    res.send('Hello world!!!');
});

//GET - list of all tasks
app.get('/api/todos', (req, res) => {
    res.send(todos);
});

//GET - find specific task data
app.get('/api/todos/:id', (req, res) => {
    //find todo task
    const todo = todos.find(c => c.id === req.params.id);
    if (!todo) return res.status(404).send('The todo task with give Id was not found'); //if not found, return 404 object not found
    res.send(todo); //if found send object
});

//POST - add new todo
app.post('/api/todos', (req, res) => {
    console.log(req.body);
    // const { error } = validate(req.body); //validate input
    // if (error) return res.status(400).send(error.details[0].message);

    // //if valid push to array
    // const todo = {
    //     id: todos.length + 1,
    //     text: req.body.text,
    // };
    // todos.push(todo);
    // res.send(todo);
});

//PUT - update todo
app.put('/api/todos/:id', (req, res) => {
    const todo = todos.find(c => c.id === req.params.id); //find task
    if (!todo) return res.status(404).send('The todo task with give Id was not found'); //if not found, return 404 object not found
    //validate, if error return 400 - bad request

    const { error } = validate(req.body); //validate input
    if (error) return res.status(400).send(error.details[0].message); //if invalid input, return 400 bad request

    //if valid input update todos, return updated
    todo.text = req.body.text;
    res.send(todo);
});

//DELETE - remove todo
app.delete('/api/todos/:id', (req, res) => {
    const todo = todos.find(c => c.id === req.params.id); //find task
    if (!todo) return res.status(404).send('The todo task with give Id was not found'); //if not found, return 404 object not found

    //if found remove from array, return removed task
    const index = todos.indexOf(todo);
    todos.splice(index, 1);
    res.send(todo);
});

//validate input data
function validate(todo) {
    const schema = {
        text: Joi.string().min(3).required(),
        priority: Joi.number().integer().min(1).max(5),
        done: Joi.boolean()
    };
    const data = Joi.validate(todo, schema);
    console.log(data);
}


//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));