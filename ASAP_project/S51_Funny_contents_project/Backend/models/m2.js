const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    country: String,
    age: Number,
    password: String,
})

const users = mongoose.model('users', userSchema);

module.exports = users;
