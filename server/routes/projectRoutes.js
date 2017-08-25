const projectRoutes = require('express').Router();
const User = require('../models/user');
const Project = require('../models/project');

let getAllUsers = () => {
    return new Promise((resolve, reject) => {
        User.find({})
            .then((users) => {
                resolve(users);
            })
            .catch((err) => {
                reject(true);
            })
    });
}

projectRoutes.post('/projects', (req, res) => {

    // create a user
    let newProject = new Project({
        title: req.body.title,
    });

    let ifUserExists = () => {
        return new Promise((resolve, reject) => {
            User.findOne({ _id: req.body.owner })
                .then((user) => {
                    newProject.owner = { ownerId: user._id, ownerName: user.userName };
                    newProject.users = { userId: user._id, userName: user.userName };
                    resolve(true);
                })
                .catch((err) => {
                    reject(true);
                })
        });
    }

    // save the sample user
    ifUserExists()
        .then(() => {
            newProject.save()
                .then((savedProject) => {
                    console.log('Project saved successfully');
                    res.json(savedProject);
                })
                .catch((err) => {
                    console.log(err.message);
                    res.json({ error: 'There was an error with your submitted data, Most probably project already exists' });
                })
        })
        .catch(() => {
            res.json({ error: 'The user/owner id provided by you is not valid. Please provide a valid user/owner id.' });
        })

});

projectRoutes.get('/projects', (req, res) => {
    Project.find({})
        .then((projects) => {
            res.json(projects);
        })
        .catch((err) => {
            res.json(err.message);
        })
});

projectRoutes.get('/projects/:id', (req, res) => {
    Project.findOne({ _id: req.params.id })
        .then((project) => {
            res.json(project);
        })
        .catch((err) => {
            res.json({ error: `Couldn't find a Project with ID:'${req.params.id}', Please provide a valid ID` });
        })
});

projectRoutes.put('/projects/:id', (req, res) => {
    getAllUsers()
        .then((users) => {
            let updatedProject = {};

            let foundOwner = users.filter((user) => user._id.toString() === req.body.owner);
            if (req.body.title) updatedProject.title = req.body.title;

            if (req.body.owner && foundOwner.length === 0) res.json(
                { error: `${req.body.owner} is not a valid user ID, Please provide a valid ID.` }
            );

            if (foundOwner.length > 0) updatedProject.owner = { ownerId: foundOwner[0]._id, ownerName: foundOwner[0].userName };

            if (req.body.users && req.body.users.length > 0) {
                req.body.users.forEach((reqUser, index) => {
                    let found = users.some((fetchedUser) => fetchedUser._id.toString() === reqUser);
                    if (!found) {
                        res.json({
                            error: `ID at index:${index} is not a valid user ID, Please remove it or replace with a valid ID`
                        });
                    }
                });

                let usersArrOfObj = [];
                req.body.users.forEach((reqUser) => {
                    let userObj = {};
                    users.forEach((fetchedUser) => {
                        if (reqUser === fetchedUser._id.toString()) {
                            userObj.userId = fetchedUser._id;
                            userObj.userName = fetchedUser.userName;
                            usersArrOfObj.push(userObj);
                        }
                    });
                });

                updatedProject.users = usersArrOfObj;
            }



            if (req.body.title === "") {
                res.json({ error: "title is required to update any project" });
            } else {
                Project.findOneAndUpdate({ _id: req.params.id }, updatedProject)
                    .then((user) => {
                        console.log('Project updated successfully');
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
        .catch((err) => {
            res.json({ error: err.message });
        })

})

projectRoutes.delete('/project/:id', (req, res) => {
    Project.findByIdAndRemove({ _id: req.params.id })
        .then((project) => {
            console.log('Project deleted successfully');
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(err);
        })
})










module.exports = projectRoutes;