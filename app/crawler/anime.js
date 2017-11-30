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
}

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
        console.log('Fetching ----> ' + categories[i]);
        if (categories[i] != null) {
            request(categories[i], (error, response, body) => {
                if (error) {
                    throw error;
                }
                const $ = loadBody(body);
                var aux = new Array();
                var anime = { nome : "", link : "", imagem : "", ano : "", sinopse : "", categorias : "" };
                $('body').children('home').children('div').children('div').children().children('ul').children('li').each(function (index, row) {
                    anime.nome = $(this).children('a').children('p').children('h3').text();
                    anime.imagem = $(this).children('img').attr('data-src');
                    anime.link = $(this).children('a').attr('href');
                    aux[index] = anime;
                });
                animes[i] = aux;
                createFile('./data/anime' + i + '.txt', aux);
                getAnimeEpisodes(aux);
            });
        } else {
            console.log('Failed to fetching ----> ' + categories[i]);
        }
    }
}

function getAnimeEpisodes(array) {
    console.log('#LOG Start get animes episodes');
    for (i in array) {
        console.log('Fetching ----> ' + array[i].link);
        if (array[i].link != null) {
            request(array[i].link, (error, response, body) => {
                if (error) {
                    throw error;
                }
                const $ = loadBody(body);
                var aux = new Array();
                var anime = { nome : "", link : "", imagem : "" };

                console.log($('body').children('home').children('div').children().children().next().children().next().text());
                array[i].sinopse = $('body').children('home').children('div').children().children().next().children().next().text();

                $('body').children('home').children('div').children().next().children().next().children('ul').children('li').each(function (index, row) {
                    aux[index] = $(this).children('p').children('a').attr('href');
                });
                episodes[i] = aux;
                createFile('./data/episode' + i + '.txt', aux);
                // getEpisodesLink(aux);
            });
        } else {
            console.log('Failed to fetching ----> ' + array[i].link);
        }
    }
}

function getEpisodesLink(array) {
    console.log('#LOG Start get animes episodes links');
    for (i in array) {
        console.log('Fetching ----> ' + array[i]);
        if (array[i] != null) {
            request(array[i], (error, response, body) => {
                if (error) {
                    throw error;
                }
                const $ = loadBody(body);
                var aux = new Array();
                $('video').children('source').each(function (index, row) {
                    aux[index] = ($(this).attr('src'));
                });
                createFile('./data/episodeLink.txt', aux);
            });
        } else {
            console.log('Failed to fetching ----> ' + array[i]);
        }
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