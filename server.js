var http = require('http');
var app = require('./config/express');
var config = require('./config/config');
var crawler = require('./app/crawler/anime.js');
http.createServer(app).listen(3000, () => {
    console.log('Server start!');
    crawler.Init();
});