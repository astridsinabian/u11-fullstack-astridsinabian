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