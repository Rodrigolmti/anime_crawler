var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var urlAnime = "http://assistiranimes.net/animes/?pagina=animes#!home";
var episodeLink = new Array();
var categories = new Array();
var videoLink = new Array();
var episodes = new Array();
var animes = new Array();

var init = function (url) {
    getCategories(url);
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
        getAnimes();
    });
}

function getAnimes() {
    console.log('#LOG Start get animes');
    for (i in categories) {
        request(categories[i], (error, response, body) => {
            if (error) {
                throw error;
            }
            const $ = loadBody(body);

            var array = new Array();
            $('body').children('home').children('div').children('div').children().children('ul').children('li').each(function (index, row) {
                array[index] = $(this).children('a').attr('href');
            });
            animes[i] = array;
            console.log(array.length);
            getAnimeEpisodes(array);
        });
    }
}

function getAnimeEpisodes(array) {
    console.log('#LOG Start get animes episodes');
    for (i in array) {
        if (array[i] != '' && array[i] != 'assistiranimes.net') {
            request(array[i], (error, response, body) => {
                if (error) {
                    throw error;
                }
                const $ = loadBody(body);
                var aux = new Array();
                $('body').children('home').children('div').children().next().children().next().children('ul').children('li').each(function (index, row) {
                    aux[index] = $(this).children('a').attr('href');
                });
                episodes[i] = aux;
                console.log(aux.length);
                getEpisodesLink(aux);
            });
        }
    }
}

function getEpisodesLink(array) {
    console.log('#LOG Start get animes episodes links');
    for (i in array) {
        request(array[i], (error, response, body) => {
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
    init(urlAnime);
};

module.exports.Init = start;


// $('body').children().next().children('home').children('div').children('div').each(function (index, row) {
//     console.log($(this).children('div').children('p').children('video').children('source').attr(''));
// });
// });