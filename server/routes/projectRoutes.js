const projectRoutes = require('express').Router();
const User = require('../models/user');
const Project = require('../models/project');

toUsersArrayFromIdArray = (arr) => {
    let initialLength = arr.length;
    let firstId = arr[0];
    let usersArr = [];
    return new Promise((resolve, reject) => {
        let findUser = (id) => {
            userObj = {};
            User.findOne({ _id: id })
                .then((user) => {
                    userObj.userName = user.userName;
                    userObj.userId = user._id;
                    arr.splice(0, 1);
                    if (arr.length > -1) {
                        findUser(arr);
                    }
                    if (usersArr.length === initialLength) {
                        resolve(usersArr);
                    }
                })
                .catch((err) => {
                    res.json({ error: `'${id}' is not a valid ID, Kindly remove it from the users array or add a valid one. ` });
                    reject(true);
                })
        }
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
    let updatedProject = {};

    if (req.body.title) updatedProject.title = req.body.title;

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