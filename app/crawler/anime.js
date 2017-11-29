var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var urlAnime = "http://assistiranimes.net/animes/?pagina=animes#!home";
var episodeLink = new Array();
var categories = new Array();
var videoLink = new Array();
var episodes = new Array();
var animes = new Array();

var getAnimes = function (url) {
    getCategories(url);
    // fs.readFile('./app/mock/data.html', 'utf8', (error, data) => {
    //     if (error) {
    //         throw error
    //     }

    //     var $ = cheerio.load(data, {
    //         ignoreWhitespace: true,
    //         xmlMode: true
    //     });

    //     $('body').children('home').children('div').children('div').children('ul').children('li').each(function (index, row) {
    //         console.log($(this).children('a').attr('href'));
    //     });
    // });

    // request(url, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         const $ = cheerio.load(body, {
    //             ignoreWhitespace: true,
    //             xmlMode: true
    //         });

    //         $('a').each(function (index, row) {
    //             links[index] = $(this).attr('href');
    //         });

    //         for (i in links) {
    //             request(links[i], function (error, response, body) {
    //                 if (!error && response.statusCode == 200) {
    //                     const anime = cheerio.load(body, {
    //                         ignoreWhitespace: true,
    //                         xmlMode: true
    //                     });

    //                     anime('body').children('home').children('div').children('div').next().children('input').children('ul').children('li').each((index, row) => {
    //                         episodeLink[index] = anime(this).children('p').children('a').attr('href');
    //                     });

    //                     episodes[i] = episodeLink;
    //                     console.log(episodeLink.length);
    //                 }
    //             });
    //         }
    //     }
    // });
};

function getCategories(url) {
    console.log('#LOG Start get categories');
    request(url, (error, response, body) => {
        if (error) {
            throw error;
        }
        const $ = loadBody(body);

        $('body').children('home').children('div').children('div').children('ul').children('li').each(function (index, row) {
            categories[index] = $(this).children('a').attr('href');
        });

        createFile('./data/categorias.txt', categories);
        getCategoryAnime();
    });
}

function getCategoryAnime() {
    console.log('#LOG Start get animes');
    for (i in categories) {
        request(categories[i], (error, response, body) => {
            if (error) {
                throw error;
            }
            const $ = loadBody(body);

            var aux = new Array();
            $('a').each(function (index, row) {
              aux[index] = $(this).attr('href');  
            });
            animes[i] = aux
            createFile('./data/animes.txt', animes);
            getAnimeEpisodes();
        });
    }
}

function getAnimeEpisodes() {
    console.log('#LOG Start get animes episodes');
    for (i in animes) {
        request(animes[i], (error, response, body) => {
            if (error) {
                throw error;
            }
            const $ = loadBody(body);

            $('a').each(function (index, row) {
                episodes[index] = $(this).attr('href');
                console.log(episodes[index]);
            });

            createFile('./data/episodes.txt', episodes);
            getEpisodesLink();
        });
    }
}

function getEpisodesLink() {
    console.log('#LOG Start get animes episodes links');
    for (i in episodes) {
        request(episodes[i], (error, response, body) => {
            if (error) {
                throw error;
            }
            const $ = loadBody(body);

            $('body').children('home').children('div').children('div').next().children('input').children('ul').children('li').each((index, row) => {
                episodeLink[index] = $(this).children('p').children('a').attr('href');
            });

            createFile('./data/episodeLink.txt', episodeLink);
            getEpisodesLink();
        });
        
    }
}

function createFile(fileName, array) {
    fs.writeFileSync(fileName, array.join('\n'));
}

function loadBody(url) {
    return cheerio.load(url, {
        ignoreWhitespace: true,
        xmlMode: true
    });
}

var start = function () {
    getAnimes(urlAnime);
};

module.exports.Init = start;


// $('body').children().next().children('home').children('div').children('div').each(function (index, row) {
//     console.log($(this).children('div').children('p').children('video').children('source').attr(''));
// });
// });