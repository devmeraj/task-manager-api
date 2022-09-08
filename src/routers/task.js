const express = require('express');
const { isValidObjectId } = require('mongoose');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Task = require('../models/task');

// Create new task route,
router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({...req.body, owner: req.user._id});
        await task.save();
        res.send(task);
    } catch(err){
        res.status(500).send("Server Error");
    }
});

// Read tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] =parts[1];
    }


    if(req.query.completed) {
        match.completed = req.query.completed;
    }


    try{
        const user = await req.user.populate({
            path: 'tasks',
            match,
            sort, 
            options: {
                limit: req.query.limit,
                skip: req.query.skip
            }
        });

        res.send(user.tasks);
    } catch(err){
        res.status(500).send(err.message);
    }
});

// Edit tasks 
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allwoedUpdates = ["description", "completed"];

    if(updates.length < 1){
        return res.status(400).send({error: "No data has been provided!"});
    }

    const validUpdate = updates.every(update => allwoedUpdates.includes(update));

    if(!validUpdate){
        return res.status(400).send({error: "Not a valid update"});
    }

    const task = await Task.findOne({_id: req.params.id, 'tokens.token': req.token});

    updates.forEach(update => task[update] = req.body[update]);

    try{
        await task.save();
        res.send(task);
    } catch(err){
        res.status(500).send(err);
    }
});

// Delete tasks
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id});
        await task.remove();
        res.send();
    } catch(err){
        res.status(500).send({error: "Server Error"});
    }
});

module.exports = router;