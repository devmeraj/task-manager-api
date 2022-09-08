const request = require("supertest");
const app = require('../src/app');
const Task = require("../src/models/task");
const {userOne, _id, taskOne, taskOneId, taskTwo, taskTwoId, setupDatabase} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create new task", async () => {
    const response = await request(app).post("/tasks").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send(taskTwo).expect(200);

    const task = await Task.findOne({_id: taskTwoId});

    expect(task).toMatchObject({
        description: "Test Task 2",
        completed: false,
        owner: _id
    });
});


test("Should fetch existing task", async () => {
    const response = await request(app).get("/tasks").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
});

test("Should delete task by authenticated user", async () => {
    await request(app).delete("/tasks/" + taskOneId).set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
});