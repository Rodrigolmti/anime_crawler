var path = require('path');
var morgan = require('morgan');
var config = require('./config');
var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var app = express();

app.set('secret', config.secret);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

consign({
		cwd: 'app'
	})
	.include('models')
	.then('api')
	.then('routes')
	.into(app);

module.exports = app;