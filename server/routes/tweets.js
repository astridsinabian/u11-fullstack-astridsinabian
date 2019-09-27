const Tweet = require('../models/Tweet');
const User = require('../models/User');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/add', (req, res) => {
    const token = req.body.token || req.body.headers.Authorization;
    if (!token) {
     return res.status(401).json({message: 'Must pass token'});
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) throw err;

        User.findById({
            '_id': user.id
            }, (err, user) => {
                if (user.id.match(/^[0-9a-fA-F]{24}$/)) {
                if (err) throw err;

                const newTweet = new Tweet({
                    publisherID: user.id,
                    username: user.username,
                    text: req.body.data.text
                });

                newTweet.save()
                    .then(tweet => res.json(tweet))
                    .catch(err => console.log(err))
            }
        });
    });
});

router.get('/', (req, res) => {
    Tweet.find()
        .sort({ createdAt: -1 })
        .then(tweets => res.json(tweets))
        .catch(err => console.log(err))
});

module.exports = router;