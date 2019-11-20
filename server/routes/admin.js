const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.get('/users', (req, res) => {
    const token = req.body.token || req.headers.authorization;

    if (!token) {
      return res.status(401).json({message: 'Must pass token'});
    }

    try {
        jwt.verify(token, process.env.TOKEN_SECRET, function(error, user) {
            if (error) throw error;
            User.find()
                .then(users => res.json(users))
                .catch(err => res.json(err));
        });
    } catch(error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({message: 'jwt expired'});
        }
    }
});

router.patch('/editUser', (req, res) => {
    User.findByIdAndUpdate({
        '_id': req.body.user._id
        }, {
            "firstname": req.body.user.firstname,
            "lastname": req.body.user.lastname,
            "email": req.body.user.email,
            "admin": req.body.user.admin
        }, { new: true },
        (err, user) => {
            if(err) {
                res.json({ status: "error", message: `${err}` });
            }
            res.status(200).json(user);
        }
    );
});

router.delete('/deleteUser/:id', (req, res) => {
    User.findByIdAndRemove({'_id': req.params.id},
        err => {
            if(err) {
                res.json({ status: "error", message: `${err}` });
            }
            res.status(200).json("Removed!");
        }
    );
});

module.exports = router;