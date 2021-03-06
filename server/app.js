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
const verifyToken = require('./middleware/verifyToken');
const projectRoutes = require('./routes/projectRoutes');
const issueRoutes = require('./routes/issueRoutes');
const commentRoutes = require('./routes/commentRoutes');

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
app.use('/', verifyToken);
app.use('/', projectRoutes);
app.use('/', issueRoutes);
app.use('/', commentRoutes);

app.listen(port);

console.log('Magic happens at http://localhost:' + port);
