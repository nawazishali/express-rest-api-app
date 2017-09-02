const issueRoutes = require('express').Router();
const User = require('../models/user');
const Project = require('../models/project');
const Issue = require('../models/issue');
const Comment = require('../models/comment');


let getUsersAndProjects = () => {
    return new Promise((resolve, reject) => {
        User.find({})
            .then((users) => {
                let usersAndProjects = {};
                usersAndProjects.users = users;
                Project.find({})
                    .then((projects) => {
                        usersAndProjects.projects = projects;
                        resolve(usersAndProjects);
                    })
                    .catch((err) => {
                        console.log(err.message);
                        reject(true);
                    })
            })
            .catch((err) => {
                console.log(err.message);
            })
    });
}

issueRoutes.post('/issues', (req, res) => {
    let newIssue = new Issue({
        title: req.body.title,
        description: req.body.description,
        state: req.body.state,
    });

    let ifIssueObjReady = () => {
        return new Promise((resolve, reject) => {
            getUsersAndProjects()
                .then((obj) => {
                    let project = obj.projects.filter((project) => project._id.toString() === req.body.project);

                    if (req.body.project && project.length === 0) {
                        res.json({ error: `ID:${req.body.project} is not a valid project ID, Please provide a valid project ID` });
                    }
                    if (project.length > 0) {
                        newIssue.project = { projectId: req.body.project, projectTitle: project[0].title };
                    }

                    let assignee = obj.users.filter((user) => user._id.toString() === req.body.assignee);

                    if (req.body.assignee && assignee.length === 0) {
                        res.json({ error: `ID:${req.body.assignee} is not a valid user ID, Please provide a valid user ID` });
                    }
                    if (assignee.length > 0) {
                        newIssue.assignee = { assigneeId: req.body.assignee, assigneeName: assignee[0].userName };
                    }

                    let creator = obj.users.filter((user) => user._id.toString() === req.body.creator);

                    if (req.body.creator && creator.length === 0) {
                        res.json({ error: `ID:${req.body.creator} is not a valid user ID, Please provide a valid user ID` });
                    }
                    if (creator.length > 0) {
                        newIssue.creator = { creatorId: req.body.creator, creatorName: creator[0].userName };
                    }
                    resolve(true);
                })
                .catch((err) => {
                    console.log(err.message);
                    reject(true);
                });
        });
    }

    ifIssueObjReady()
        .then(() => {
            newIssue.save()
                .then((savedIssue) => {
                    console.log('Issue Saved successfully')
                    res.json(savedIssue);
                })
                .catch((err) => {
                    res.json({ error: 'There was an error with your submitted data, Most probably issue already exists' });
                });
        })
        .catch((err) => {
            console.log(err.message);
        });


});

issueRoutes.get('/issues', (req, res) => {
    Issue.find({})
        .then((issues) => {
            res.json(issues);
        })
        .catch((err) => {
            res.json({ error: err.message });
        });
});

issueRoutes.get('/issues/:id', (req, res) => {
    Issue.findOne({ _id: req.params.id })
        .then((issue) => {
            res.json(issue);
        })
        .catch((err) => {
            res.json({ error: err.message });
        });
});


issueRoutes.put('/issues/:id', (req, res) => {
    let updatedIssue = {};
    if (!req.body.title || req.body.title === "") {
        res.json({ error: "title is required to update any issue" });
    }
    if (!req.body.description || req.body.description === "") {
        res.json({ error: "description is required to update any issue" });
    }
    if (!req.body.state || req.body.state === "") {
        res.json({ error: "state is required to update any issue" });
    }
    if (!req.body.project || req.body.project === "") {
        res.json({ error: "project is required to update any issue" });
    }
    if (!req.body.creator || req.body.creator === "") {
        res.json({ error: "creator is required to update any issue" });
    }
    if (req.body.title && req.body.description && req.body.state) {
        updatedIssue.title = req.body.title;
        updatedIssue.description = req.body.description;
        updatedIssue.state = req.body.state;
    }
    getUsersAndProjects()
        .then((obj) => {
            console.log(req.body.project);
            let project = obj.projects.filter((project) => project._id.toString() === req.body.project);
            if (project.length === 0) {
                res.json({ error: `${req.body.project} is not a valid Project ID, Please provide a valid ID.` });
            } else {
                updatedIssue.project = { projectId: req.body.project, projectTitle: project[0].title };
            }

            let creator = obj.users.filter((user) => user._id.toString() === req.body.creator);
            if (creator.length === 0) {
                res.json({ error: `${req.body.creator} is not a vald user ID, Please provide a valid ID.` });
            } else {
                updatedIssue.creator = { creatorId: req.body.creator, creatorName: creator[0].userName };
            }

            let assignee = obj.users.filter((user) => user._id.toString() === req.body.assignee);
            if (req.body.assignee && assignee.length === 0) {
                res.json({ error: `${req.body.assignee} is not a vald user ID, Please provide a valid ID.` });
            } else if (req.body.assignee && assignee.length === 1) {
                updatedIssue.assignee = { assigneeId: req.body.assignee, assigneeName: assignee[0].userName };
            }

            Issue.findOneAndUpdate({ _id: req.params.id }, updatedIssue)
                .then((returnedIssue) => {
                    console.log('Issue updated successfully');
                    res.json({ success: true });
                })
                .catch(() => {
                    console.log(err);
                });
        })

});

let deleteRelatedComments = (relatedComments) => {
    return new Promise((resolve, reject) => {
        let commentToDelete = relatedComments[0];
        Comment.findByIdAndRemove({ _id: commentToDelete._id })
            .then(() => {
                relatedComments.splice(0, 1);
                if (relatedComments.length > -1) {
                    deleteRelatedComments(relatedComments);
                } else {
                    resolve(true);
                }
            })
    });
}

issueRoutes.delete('/issues/:id', (req, res) => {
    let relatedComments;
    Issue.findOneAndRemove({ _id: req.params.id })
        .then(() => {
            Comment.find({})
                .then((comments) => {
                    relatedComments = comments.filter((comment) => comment.commentedOn.commentId === req.params.id);
                    return deleteRelatedComments(relatedComments);
                })
        })
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            res.json({ error: err.message });
        })
});


module.exports = issueRoutes;