const mongoose = require("mongoose");

const retweetSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  username: {
    type: String,
    trim: true
  },
  retweetUser: {
    type: String,
    trim: true
  },
  retweetTweet: {
    type: String
  },
  retweetText: {
    type: String,
    max: 400
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Retweet", retweetSchema);
