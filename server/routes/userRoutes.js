const userRoutes = require('express').Router();
const User = require('../models/user');
const Project = require('../models/project');
const Issue = require('../models/issue');
const Comment = require('../models/comment');

userRoutes.post('/users', (req, res) => {

    // create a user
    let newUser = new User({
        userName: req.body.userName,
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
            res.json(
                {
                    error: 'There was an error with your submitted data, Most probably user already exists'
                });
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
    let updatedUser = {};

    if (req.body.userName) updatedUser.userName = req.body.userName;
    if (req.body.password) updatedUser.password = req.body.password;

    if (req.body.userName === "" && req.body.password === "") {
        res.json({ error: "At least a userName or a password is required to update any user" });
    } else {
        let user;
        User.findOneAndUpdate({ _id: req.params.id }, updatedUser)
            .then((returnedUser) => {
                user = returnedUser;
                return Project.findOneAndUpdate(
                    { "users.userId": user._id.toString() },
                    { users: { userName: user.userName, userId: user._id.toString() } });
            })
            .then(() => {
                return Project.findOneAndUpdate(
                    { "owner.ownerId": user._id.toString() },
                    { owner: { ownerName: user.userName, ownerId: user._id.toString() } });
            })
            .then(() => {
                return Issue.findOneAndUpdate(
                    { "creator.creatorId": user._id.toString() },
                    { creator: { creatorName: user.userName, creatorId: user._id.toString() } });
            })
            .then(() => {
                return Issue.findOneAndUpdate(
                    { "assignee.assigneeId": user._id.toString() },
                    { assignee: { assigneeName: user.userName, assigneeId: user._id.toString() } });
            })
            .then(() => {
                return Comment.findOneAndUpdate(
                    { "postedBy.posterId": user._id.toString() },
                    { postedBy: { posterName: user.userName, posterId: user._id.toString() } });
            })
            .then(() => {
                console.log('User updated successfully');
                res.json({ success: true });
            })
            .catch((err) => {
                res.json({ error: err.message });
            })
    }

});

userRoutes.delete('/users/:id', (req, res) => {
    User.findByIdAndRemove({ _id: req.params.id })
        .then((user) => {
            return Project.findOneAndUpdate(
                { "users.userId": user._id },
                { $pull: { users: { userId: user._id } } })
        })
        .then(() => {
            res.send({ success: true });
        })
        .catch((err) => {
            res.json({ error: err.message });
        })
});


module.exports = userRoutes;
