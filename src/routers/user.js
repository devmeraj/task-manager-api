const express = require('express');
const router = new express.Router();
const User = require('../models/user');

// User Registration route handler
router.post('/users', async (req, res) => {

    try {
        const user = new User(req.body);
        const token = await user.generateWebToken();

        req.user = user;
        req.token = token
        await user.save();
        res.status(201).send({user, token});
    } catch(e){
        res.status(500).send(e);
    }
});


// User Login route handler
router.post('/users/login', async(req, res) => {
    res.send('user login endpoint');
});

// User Logout from all devices route handler
router.get('/users/logout-all', async(req, res) => {
    res.send('user logout everywhere endpoint');
});

// User Profile route handler
router.get('/users/me', async(req, res) => {
    res.send('user profile endpoint');
});

// User Update route handler
router.patch('/users/me', async(req, res) => {
    res.send('user profile update endpoint');
});

// User delete route handler
router.delete('/users/me', async(req, res) => {
    res.send('user profile delete endpoint');
});

module.exports = router;