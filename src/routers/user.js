const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middlewares/auth');

// User Registration route handler
router.post('/users', async (req, res) => {

    try {
        const user = new User(req.body);
        const token = await user.generateWebToken();

        
        req.user = user;
        req.token = token;

        await user.save();
        res.status(201).send({user, token});
    } catch(e){
        res.status(500).send(e);
    }
});


// User Login route handler
router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findAndLogin(req.body.email, req.body.password);
        const token = await user.generateWebToken();
        
        req.user = user;
        req.token = token;

        await user.save()

        res.send({user, token});
    } catch(err){
        res.status(400).send(err.message);
    }
});

// User Logout route handler
router.get('/users/logout', auth, async(req, res) => {
    req.user.tokens = req.user.tokens.filter(token => token.token != req.token);
    await req.user.save();
    res.send();
});

// User Logout from all devices route handler
router.get('/users/logout-all', auth, async(req, res) => {
    req.user.tokens = [];
    await req.user.save();
    res.send()
});

// User Profile route handler
router.get('/users/me', auth, async(req, res) => {
    res.send(req.user);
});

// User Update route handler
router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    
    if (updates.length < 1){
        return res.status(400).send("No data provided");
    }

    const allowedUpdates = ["name", "email", "password", "age"];
    const validUpdate = updates.every(update => allowedUpdates.includes(update));
    if (!validUpdate){
        return res.status(400).send("No valid field provided");
    }

    updates.forEach(update=> {
        req.user[update] = req.body[update];
    });

    try {
        await req.user.save();
        return res.send(req.user);
    } catch(err){
        res.status(500).send("Server Error");
    }
});

// User delete route handler
router.delete('/users/me', auth, async(req, res) => {
    await req.user.remove();
    res.send();
});

module.exports = router;