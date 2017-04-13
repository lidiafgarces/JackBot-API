var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var apiRoute = require('./app/routes/routes');

mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.use('/api', apiRoute);

app.listen(port);
console.log('RESTful API server started on: ' + port);