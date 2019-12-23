const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
// const verifyToken = require('./verifyToken');

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
        description: req.body.description,
        admin: req.body.admin
    });

    try {
        const savedUser = await user.save();
        res.send({user: user._id});

    } catch(err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body.user);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({username: req.body.user.username});
    if(!user) return res.status(400).send('Användaren finns inte');

    const validPassword = await bcrypt.compare(req.body.user.password, user.password);
    if(!validPassword) return res.status(400).send('Ogiltigt lösenord');

    try {
        const token = jwt.sign({id: user._id, username: req.body.user.username}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        return res.status(200).send({
            token: token,
            admin: user.admin
          });
      
    } catch(err) {
        res.status(400).send(err);
    }
});

router.get('/profile', function(req, res) {
    const token = req.body.token || req.headers.authorization;

    if (!token) {
     return res.status(401).json({message: 'Must pass token'});
    }

    try {
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
    } catch(error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({message: 'jwt expired'});
        }
    }  
});

router.patch('/profile', (req, res) => {
    const token = req.body.token || req.body.headers.Authorization;
    if (!token) {
     return res.status(401).json({message: 'Must pass token'});
    }
    jwt.verify(token, process.env.TOKEN_SECRET, function(err, user) {
        if (err) throw err;
        User.findByIdAndUpdate({
            '_id': user.id
            }, {
                "username": req.body.data.username,
                "firstname": req.body.data.firstname,
                "lastname": req.body.data.lastname,
                "description": req.body.data.description
            }, { new: true },
            (err, user) => {
                if(err) {
                    res.json({ status: "error", message: `${err}` });
                }
                res.status(200).json(user);
            }
        );
    })
});

router.get('/:username', (req, res) => {
    User.findOne({ 'username': req.params.username }, (err, user) => {
        res.json({ user: user })
    })
});

router.post('/follow', (req, res) => {
    const token = req.body.token || req.body.headers.Authorization;
    if (!token) {
     return res.status(401).json({message: 'Must pass token'});
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) throw err;

        User.findByIdAndUpdate({
            '_id': user.id
            }, {
                $push: { following: req.body.data.username }
            }, { new: true })
            .then(user => {
                User.findOneAndUpdate({
                    'username': req.body.data.username
                }, {
                    $push: {
                        followers: user.username
                    }
                }, { new: true })
                .then(user => res.json({ user }))
                .catch(err => console.log(err))  
            })
            .catch(err => console.log(err))
    })
});

router.post('/unfollow', (req, res) => {
    const token = req.body.token || req.body.headers.Authorization;
    if (!token) {
     return res.status(401).json({message: 'Must pass token'});
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) throw err;

        User.findByIdAndUpdate({
            '_id': user.id
            }, {
                $pull: { following: req.body.data.username }
            }, { new: true })
            .then(user => {
                User.findOneAndUpdate({
                    'username': req.body.data.username
                }, {
                    $pull: {
                        followers: user.username
                    }
                }, { new: true })
                .then(user => res.json({ user }))
                .catch(err => console.log(err))  
            })
            .catch(err => console.log(err))
    });
});

router.post('/search', (req, res) => {
    User.findOne({ 'username': req.body.text })
        .then(user => res.json({ user}))
        .catch(err => res.status(404).json({ msg: 'User not found' }))
});

module.exports = router;

