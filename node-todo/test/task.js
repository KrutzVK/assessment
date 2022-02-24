let chai = require('chai');
let chaiHttp = require('chai-http');
const { response } = require('express');
let server = require('../index.js');

//Assertion styel should
chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {
    //Test GET
    describe("GET /todos", () => {
        it("It should GET all tasks", (done) => {
            chai.request(server)
                .get("/todos")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        })

        it("It should NOT GET all tasks", (done) => {
            chai.request(server)
                .get("/todo")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                })
        })
    })


    //Test GET (by id)

    describe("GET /todos/:id", () => {
        it("It should GET a task by ID", (done) => {
            const taskId = 1;
            chai.request(server)
                .get("/todos/" + taskId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('text');
                    res.body.should.have.property('priority');
                    res.body.should.have.property('done');
                    res.body.should.have.property('id').eq("1");
                    done();
                });
        });

        it("It should NOT GET a task by ID", (done) => {
            const taskId = 123;
            chai.request(server)
                .get("/todos/" + taskId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.text.should.be.eq("The todo task with give Id was not found");
                    done();
                });
        });
    });

    //Test POST 
    describe("POST /todos", () => {
        it("It should POST a new task", (done) => {
            const task = {
                "text": "TestPOST",
                "priority": 3,
                "done": false
            };
            chai.request(server)
                .post("/todos")
                .send(task)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eq("4");
                    res.body.should.have.property('text').eq("TestPOST");
                    res.body.should.have.property('priority').eq(3);
                    res.body.should.have.property('done').eq(false);
                    done();
                });
        });

        it("It should NOT POST a new task without text property", (done) => {
            const task = {
                "done": false
            };
            chai.request(server)
                .post("/todos")
                .send(task)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.text.should.be.eq('"text" is required');
                    done();
                });
        });
    });


    //Test PUT
    describe("PUT /todos/:id", () => {
        it("It should PUT a task", (done) => {
            const taskId = 1;
            const task = {
                "text": "TaskChanged",
                "done": true
            };
            chai.request(server)
                .put("/todos/" + taskId)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eq("1");
                    res.body.should.have.property('text').eq("TaskChanged");
                    res.body.should.have.property('done').eq(true);
                    done();
                });
        });

        it("It should NOT PUT a task with a title less that 3 characters", (done) => {
            const taskId = 1;
            const task = {
                "text": "Ta"
            };
            chai.request(server)
                .put("/todos/" + taskId)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.be.eq('"text" length must be at least 3 characters long');
                    done();
                });
        });
    });


    //Test Delete
    describe("DELETE /todos/:id", () => {
        it("It should DELETE an existing task", (done) => {
            const taskId = 1;
            chai.request(server)
                .delete("/todos/" + taskId)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it("It should NOT DELETE a task not in file", (done) => {
            const taskId = 145;
            chai.request(server)
                .delete("/todos/" + taskId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.text.should.be.eq('The todo task with give Id was not found');
                    done();
                });
        });
    });


});