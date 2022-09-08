const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');


const _id = mongoose.Types.ObjectId();
const taskOneId = mongoose.Types.ObjectId();
const taskTwoId = mongoose.Types.ObjectId();

const userOne = {
    _id,
    name: "meraj",
    password: "1234567",
    email: "merajulnu@gmail.com",
    age: 29,
    tokens: [{
        token: jwt.sign({_id}, process.env.JWT_SECRET_KEY)
    }]
}

const taskOne = {
    _id: taskOneId,
    owner: _id,
    description: "Test Task"
}

const taskTwo = {
    _id: taskTwoId,
    owner: _id,
    description: "Test Task 2"
}

const setupDatabase = async () => {
    try {
    if(mongoose.connection.db){
     await User.deleteMany();
    } else {
        mongoose.connect(process.env.MONGODB_CONNECTION_URL);
    }
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new Task(taskOne).save();
    } catch(err){
        throw new Error(err);
    }
}

module.exports = {
    setupDatabase,
    _id,
    userOne,
    taskOne,
    taskOneId,
    taskTwo,
    taskTwoId
}