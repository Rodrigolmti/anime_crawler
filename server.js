var http = require('http');
var app = require('./config/express');
var config = require('./config/config');
var crawler = require('./app/crawler/anime.js');
var http = require('http');
var app = require('./config/express');
var config = require('./config/config');
require('./config/database')(config.database);

http.createServer(app).listen(3001, () => {
    console.log('Server start!');
    crawler.Init();
});