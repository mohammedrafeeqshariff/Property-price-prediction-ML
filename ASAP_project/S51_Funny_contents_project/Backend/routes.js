const express = require('express');
const users = require('./models/m2');
const contents = require('./models/models');
const validators = require('./validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const getRouter = express.Router();
const JWT_SECRET = process.env.SECRET_ACCESS_TOKEN;

// Fetch DATA
getRouter.get('/GET', async (req, res) => {
    try {
        const details = await contents.find();
        if (details.length === 0) {
            return res.status(404).json({ message: 'No details found' });
        }
        res.status(200).json(details);
    } catch (err) {
        console.error('GET error', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Upload DATA
getRouter.post('/POST', async (req, res) => {
    try {
        const { error, value } = validators.PostAndUpdateValidator(req.body);
        if (error) {
            return res.status(400).json(error.details);
        }
        const { content, userID, username, age, country } = req.body;
        const newContent = new contents({ content, userID, username, age, country });
        await newContent.save();
        res.status(200).json({ message: 'Successfully added content', newContent });
    } catch (error) {
        console.error('POST error', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Signup USER
getRouter.post('/SIGNUP', async (req, res) => {
    try {
        const { error, value } = validators.AuthValidator(req.body);
        if (error) {
            return res.status(400).json(error.details);
        }
        const { username, country, age, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new users({ username, country, age, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ newUser });
    } catch (err) {
        console.error('POST error', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login USER
getRouter.post('/LOGIN', async (req, res) => {
    try {
        const { username, password } = req.body;
        const signedUpUser = await users.findOne({ username });
        if (!signedUpUser) {
            return res.status(400).json({ message: 'Username not found' });
        }
        const validPassword = await bcrypt.compare(password, signedUpUser.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const tokenPayload = { id: signedUpUser._id, username: signedUpUser.username };
        const authToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });
        res.json({ authToken, username, _id: signedUpUser._id });
    } catch (error) {
        console.error('LOGIN error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User
getRouter.get('/getUser/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await users.findOne({ _id: userID });
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete USER ACCOUNT
getRouter.delete('/LOGOUT', async (req, res) => {
    try {
        const { username, password } = req.body;
        const loggedInUser = await users.findOne({ username });
        if (!loggedInUser || !(await bcrypt.compare(password, loggedInUser.password))) {
            return res.status(401).json({ message: 'Invalid username/password' });
        }
        await users.findOneAndDelete({ username });
        res.status(200).json({ message: 'Logged out and user deleted successfully' });
    } catch (error) {
        console.error('Logout error', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update DATA
getRouter.patch('/PATCH/:id', async (req, res) => {
    try {
        const { error, value } = validators.PostAndUpdateValidator(req.body);
        if (error) {
            return res.status(400).json(error.details);
        }
        const { id } = req.params;
        const updates = req.body;
        const updatedUser = await contents.findOneAndUpdate({ _id: id }, { $set: updates }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Successfully updated user', updatedUser });
    } catch (err) {
        console.error('PATCH error', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete DATA
getRouter.delete('/DELETE/:id', async (req, res) => {
    const { id: _id } = req.params;
    try {
        const deleteUser = await contents.findOneAndDelete({ _id });
        if (!deleteUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Successfully Deleted user', deleteUser });
    } catch (err) {
        console.error('DELETE error', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = getRouter;
