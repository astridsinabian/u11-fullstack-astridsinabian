const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;