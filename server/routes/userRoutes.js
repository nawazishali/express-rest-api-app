const userRoutes = require('express').Router();
const User = require('../models/user');

userRoutes.post('/', (req, res) => {

    // create a user
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
    });

    // save the sample user
    newUser.save((err) => {
        if (err) {
            console.log(err);
            res.send('There was an error with your submitted data, Most probably user already exists');
        } else {
            console.log('User saved successfully');
            res.json({ success: true });
        }
    });
});


userRoutes.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        res.json(users);
    });
});

userRoutes.get('/users/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) { console.log(err) }
        res.json(user);
    });
});

userRoutes.put('/users/:id', (req, res) => {
    // create a user
    var updatedUser = {
        username: req.body.username,
        password: req.body.password,
    };

    User.findOneAndUpdate({ _id: req.params.id }, updatedUser, (err, user) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('User saved successfully');
            res.json({ success: true });
        }
    });
});

userRoutes.put('/users/:id', (req, res) => {
    // create a user
    var updatedUser = {
        username: req.body.username,
        password: req.body.password,
    };

    User.findOneAndUpdate({ _id: req.params.id }, updatedUser, (err, user) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('User updated successfully');
            res.json({ success: true });
        }
    });
});

userRoutes.delete('/users/:id', (req, res) => {
    User.findByIdAndRemove({ _id: req.params.id }, (err, user) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('User deleted successfully');
            res.json({ success: true });
        }
    });
});


module.exports = userRoutes;
