var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var urlAnime = "http://assistiranimes.net/animes/a";

var getAnimes = function (url) {
    // fs.readFile('./app/mock/data.html', 'utf8', (error, data) => {
    //     if (error) {
    //         throw error
    //     }

    //     var $ = cheerio.load(data, {
    //         ignoreWhitespace: true,
    //         xmlMode: true
    //     });

    //     $('body').children('home').children('div').children('div').next().children('input').children('ul').children('li').each(function (index, row) {
    //         console.log($(this).children('p').children('a').attr('href'));
    //     });
    // });

    var episodeLink = new Array();
    var videoLink = new Array();
    var episodes = new Array();
    var links = new Array();

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(body, {
                ignoreWhitespace: true,
                xmlMode: true
            });

            $('a').each(function (index, row) {
                links[index] = $(this).attr('href');
            });

            for (i in links) {
                request(links[i], function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        const anime = cheerio.load(body, {
                            ignoreWhitespace: true,
                            xmlMode: true
                        });

                        anime('body').children('home').children('div').children('div').next().children('input').children('ul').children('li').each(function (index, row) {
                            episodeLink[index] = anime(this).children('p').children('a').attr('href');
                        });

                        episodes[i] = episodeLink;
                        console.log(episodeLink.length);
                    }
                });
            }
        }
    });
};

var start = function () {
    getAnimes(urlAnime);
};

module.exports.Init = start;


// $('body').children().next().children('home').children('div').children('div').each(function (index, row) {
//     console.log($(this).children('div').children('p').children('video').children('source').attr(''));
// });
// });