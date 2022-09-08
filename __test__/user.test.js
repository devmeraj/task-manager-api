const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { setupDatabase, _id, userOne} = require('./fixtures/db');

beforeEach(setupDatabase);

test("Should create new user", async() => {
    const response = await request(app).post('/users')
        .send({
            name: "Mohammad", 
            email: "mdmerajulislam@hotmail.com",
            password: "1234567"
        })
        .expect(201);
    const createdUser = await User.findById(response.body.user._id);
    expect(createdUser).not.toBeNull();
});

// .set('Authorization', `Bearer ${user.tokens[0].token}`)
test("Should login existing user", async () => {
    const response = await request(app).post("/users/login").send({password: userOne.password, email: userOne.email}).expect(200);
    
    const user = await User.findById(_id);
    expect(response.body.token).toEqual(user.tokens[1].token);
});

test("Should not login non exisiting user", async () => {
    await request(app).post("/users/login").send({email: userOne.email, password: "notAValidPass88!"}).expect(400);
});

test("Should get profile for user", async() => {
    const response = await request(app).get("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);

    const user = await User.findById(response.body._id);
    expect(user.name).toBe("meraj");
});

test("Should not get profile for unauthenticated user", async() => {
    await request(app).get("/users/me").send().expect(400);
});

test("Should delete account for user", async () => {
    await request(app).delete("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
    const user = await User.findById(_id);
    expect(user).toBeNull();
});


test("Should not delete account for unauthenticated user", async () => {
    await request(app).delete("/users/me").send().expect(400);
});

test("Should update valid user field", async() => {
    const response = await request(app).patch("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send({name: "Mohammad Meraj"}).expect(200);
    const user = await User.findById(response.body._id);
    expect(user.name).toEqual("Mohammad Meraj");
});


test("Should not update invalid user field", async() => {
    const response = await request(app).patch("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send({fullName: "Mohammad Meraj"}).expect(400);
    const user = await User.findById(_id);
    expect(user.name).toEqual(userOne.name);
});