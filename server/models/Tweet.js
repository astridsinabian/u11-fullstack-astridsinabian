const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    text: {
        type: String,
        max: 400
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tweet', tweetSchema);