const userRoutes = require('express').Router();
const User = require('../models/user');

userRoutes.post('/users', (req, res) => {

    // create a user
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
    });

    // save the sample user
    newUser.save()
        .then((savedDoc) => {
            console.log('User saved successfully');
            res.json(savedDoc);
        })
        .catch((err) => {
            console.log(err.message);
            res.json({ error: 'There was an error with your submitted data, Most probably user already exists' });
        })
});


userRoutes.get('/users', (req, res) => {
    User.find({})
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            console.log(err);
        })
});

userRoutes.get('/users/:id', (req, res) => {
    User.findOne({ _id: req.params.id }).then((user) => {
        res.json(user);
    }).catch((err) => {
        console.log(err)
    })
});

userRoutes.put('/users/:id', (req, res) => {
    // create a user
    var updatedUser = {};

    if (req.body.username) updatedUser.username = req.body.username;
    if (req.body.password) updatedUser.password = req.body.password;

    if (req.body.username === "" && req.body.password === "") {
        res.json({ error: "At least a username or a password is required to update any user" });
    } else {
        User.findOneAndUpdate({ _id: req.params.id }, updatedUser)
            .then((user) => {
                console.log('User updated successfully');
                res.json({ success: true });
            })
            .catch((err) => {
                console.log(err);
            })
    }

});

userRoutes.delete('/users/:id', (req, res) => {
    User.findByIdAndRemove({ _id: req.params.id })
        .then((user) => {
            console.log('User deleted successfully');
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(err);
        })
});


module.exports = userRoutes;
