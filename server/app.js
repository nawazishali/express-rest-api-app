const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./models/user');
const port = process.env.PORT || 8080;
const userRoutes = require('./routes/userRoutes');
const authRoute = require('./routes/authRoute');

//Configurations

mongoose.connect(config.database);
app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello! Welcome to the API');
});

app.use('/', userRoutes);
app.use('/', authRoute);

app.listen(port);

console.log('Magic happens at http://localhost:' + port);
