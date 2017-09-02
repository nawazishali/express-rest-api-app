const commentRoutes = require('express').Router();
const User = require('../models/user');
const Issue = require('../models/issue');
const Comment = require('../models/comment');

let getUsersAndIssues = () => {
    return new Promise((resolve, reject) => {
        User.find({})
            .then((users) => {
                let userAndIssues = {};
                userAndIssues.users = users;
                Issue.find({})
                    .then((issues) => {
                        userAndIssues.issues = issues;
                        resolve(userAndIssues);
                    })
                    .catch((err) => {
                        console.log(err.message);
                        reject(true);
                    });
            })
            .catch((err) => {
                console.log(err.message);
            });
    });
}

commentRoutes.post('/comments', (req, res) => {
    let newComment = new Comment({
        content: req.body.content
    });
    let ifCommentObjReady = () => {
        return new Promise((resolve, reject) => {
            getUsersAndIssues()
                .then((obj) => {
                    let commentedOn = obj.issues.filter((issue) => issue._id.toString() === req.body.commentedOn);
                    if (req.body.commentedOn && commentedOn.length === 0) {
                        res.json({ error: `ID:${req.body.commentedOn} is not a valid comment ID, Please provide a valid comment ID` });
                    }
                    if (commentedOn.length > 0) {
                        newComment.commentedOn = { issueId: req.body.commentedOn, issueTitle: commentedOn[0].title }
                    }

                    let postedBy = obj.users.filter((user) => user._id.toString() === req.body.postedBy);
                    if (req.body.postedBy && postedBy.length === 0) {
                        res.json({ error: `ID:${req.body.postedBy} is not a valid user ID, Please provide a valid user ID` });
                    }
                    if (postedBy.length > 0) {
                        newComment.postedBy = { posterId: req.body.postedBy, posterName: postedBy[0].userName };
                    }
                    resolve(true);
                })
                .catch((err) => {
                    console.log(err.message);
                    reject(true);
                })
        });
    }

    ifCommentObjReady()
        .then(() => {
            newComment.save()
                .then((savedComment) => {
                    console.log('Comment saved successfully');
                    res.json(savedComment);
                })
                .catch((err) => {
                    res.json({ error: 'There was an error with your submitted data, Most probably comment already exists' });
                });
        })
        .catch((err) => {
            console.log(err.message);
        })



});

commentRoutes.get('/comments', (req, res) => {
    Comment.find({})
        .then((comments) => {
            res.json(comments);
        })
        .catch((err) => {
            res.json({ error: err.message });
        });
});

commentRoutes.get('/comments/:id', (req, res) => {
    Comment.find({ _id: req.params.id })
        .then((comment) => {
            res.json(comment);
        })
        .catch((err) => {
            res.json({ error: err.message });
        });
});

commentRoutes.put('/comments/:id', (req, res) => {
    let updatedComment = {};
    if (!req.body.content || req.body.content === "") {
        res.json({ error: "content is required to update any issue" });
    }
    if (!req.body.commentedOn || req.body.commentedOn === "") {
        res.json({ error: "commentedOn is required to update any issue" });
    }
    if (!req.body.postedBy || req.body.postedBy === "") {
        res.json({ error: "postedBy is required to update any issue" });
    }
    if (req.body.content && req.body.commentedOn && req.body.postedBy) {
        updatedComment.content = req.body.content;
    }
    getUsersAndIssues()
        .then((obj) => {
            let commentedOn = obj.issues.filter((issue) => issue._id.toString() === req.body.commentedOn);
            if (commentedOn.length === 0) {
                res.json({ error: `${req.body.commentedOn} is not a vald Issue ID, Please provide a valid ID.` });
            } else {
                updatedComment.commentedOn = { issueId: req.body.commentedOn, issueTitle: commentedOn.title };
            }

            let postedBy = obj.users.filter((user) => user._id.toString() === req.body.postedBy);
            if (postedBy.length === 0) {
                res.json({ error: `${req.body.postedBy} is not a vald User ID, Please provide a valid ID.` });
            } else {
                updatedComment.postedBy = { posterId: req.body.postedBy, posterName: postedBy.title };
            }

            Comment.findByIdAndUpdate({ _id: req.params.id }, updatedComment)
                .then(() => {
                    console.log('Issue updated successfully');
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log(err.message);
                });
        })

});

commentRoutes.delete('/comments/:id', (req, res) => {
    Comment.findByIdAndRemove({ _id: req.params.id })
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            res.json({ error: err.message });
        })
});

module.exports = commentRoutes;