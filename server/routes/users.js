const router = require('express').Router();
let User = require('../models/user.model');


// http://localhost:5000/users
router.route('/').get((req, res) => {
    User.find()
      .then(users => res.json(users))
      .catch(err => res.status(400).json(`Error: ${err}`));
});

// http://localhost:5000/users/add
router.route('/add').post((req, res) => {
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const email = req.body.email;

    const newUser = new User({
        username,
        firstname,
        lastname,
        password,
        email
    });

    newUser.save()
      .then(() => res.json('User added!'))
      .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;