const router = require('express').Router();
const User = require('../models/User');

router.get('/users', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

router.patch('/editUser', (req, res) => {
    User.findByIdAndUpdate({
        '_id': req.body.user._id
        }, {
            "firstname": req.body.user.firstname,
            "lastname": req.body.user.lastname,
            "email": req.body.user.email
        }, { new: true },
        (err, user) => {
            if(err) {
                res.json({ status: "error", message: `${err}` });
            }
            res.status(200).json(user);
        }
    );
});

router.delete('/deleteUser', (req, res) => {
    User.findByIdAndRemove({
        '_id': req.body._id
        },
        (err, user) => {
            if(err) {
                res.json({ status: "error", message: `${err}` });
            }
            res.status(200).json(user);
        }
    );
});

module.exports = router;