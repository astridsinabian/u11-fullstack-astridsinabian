const router = require('express').Router();
const User = require('../models/User');

router.get('/users', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

router.patch('/editUsers', (req, res) => {
    User.findByIdAndUpdate({
        '_id': req.body._id
        }, {
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "email": req.body.email
        }, { new: true },
        (err, user) => {
            debugger;
            if(err) {
                res.json({ status: "error", message: `${err}` });
            }
            res.status(200).json(user);
        }
    );
});

module.exports = router;