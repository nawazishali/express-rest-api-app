const authRoute = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

authRoute.post('/auth', (req, res) => {

    // find the user
    User.findOne({
        userName: req.body.userName
    }, (err, user) => {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, req.app.get('superSecret'));

                //https://stackoverflow.com/questions/10090414/express-how-to-pass-app-instance-to-routes-from-a-different-file

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});

module.exports = authRoute;