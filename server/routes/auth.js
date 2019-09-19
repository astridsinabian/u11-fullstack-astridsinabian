const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword, 
        description: req.body.description
    });
 
    try {
        const savedUser = await user.save();
        res.send({user: user._id});

    } catch(err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    // const { username, password } = req.body.user;
    const { error } = loginValidation(req.body.user);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({username: req.body.user.username});
    if(!user) return res.status(400).send('Username does not exists');

    const validPassword = await bcrypt.compare(req.body.user.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    res.header('auth-token', token).send(token);
});

router.get('/profile', function(req, res) {
    const token = req.body.token || req.query.token;
    if (!token) {
     return res.status(401).json({message: 'Must pass token'});
    }

    jwt.verify(token, process.env.TOKEN_SECRET, function(err, user) {
        if (err) throw err;
        User.findById({
            '_id': user.id
            }, function(err, user) {
                if (user.id.match(/^[0-9a-fA-F]{24}$/)) {
                if (err) throw err;
                res.json({
                    user: user
                });
            }
        });
    });
});

module.exports = router;