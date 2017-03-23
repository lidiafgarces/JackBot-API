// Set up our packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var apiRoute = require('./app/routes/routes');

// Connect to our database
mongoose.connect('mongodb://jackbot-api:IN4325IR@ds131340.mlab.com:31340/tasks-db');

// Configure body-parser
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

// Set our port
var port = 8080;

// Prefix our routes with with /simple-api
app.use('/simple-api', apiRoute);

// START THE SERVER
app.listen(port);
console.log('RESTful API server started on: ' + port);