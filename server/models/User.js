const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unqiue: true,
        trim: true,
        minlength: 6
    }, 
    firstname: {
        type: String,
        required: true,
        unqiue: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        unqiue: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unqiue: true,
        trim: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        unqiue: true,
        trim: true,
        max: 255
    },
    description: {
        type: String,
        required: false,
        trim: true,
        max: 400
    },
    followers: [],
    following: [],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);