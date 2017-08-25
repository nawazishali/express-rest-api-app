const issueRoutes = require('express').Router();
const User = require('../models/user');
const Project = require('../models/project');
const Issue = require('../models/issue');


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
                    res.json({ error: err.message });
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

});

issueRoutes.delete('/issues/:id', (req, res) => {

});


module.exports = issueRoutes;