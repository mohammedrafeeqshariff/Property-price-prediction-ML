const mongoose = require('mongoose')

const contentSchema = new mongoose.Schema({
    content:String,
    userID: String,
    username:String,
    age:Number,
    country:String
})

const contents = mongoose.model('contents', contentSchema);

module.exports = contents;