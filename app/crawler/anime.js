var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

var urlAnime = "http://assistiranimes.net/animes/?pagina=animes#!home";

var modelEpisodeLink = mongoose.model('EpisodeLink');
var modelEpisode = mongoose.model('Episode');
var modelOrder = mongoose.model('Order');
var modelAnime = mongoose.model('Anime');

var init = function (url) {
    getOrders(url);
}

function getOrders(url) {
    modelOrder.find({}).then((data) => {
        console.log('#LOG Retrive orders: ' + data.length);
        if (data.length == 0) {
            console.log('#LOG Start get orders');
            request(url, (error, response, body) => {
                if (error) {
                    throw error;
                }
                const $ = loadBody(body);
                $('body').children('home').children('div').children('div').children('ul').children('li').each(function (index, row) {
                    modelOrder.create({
                        "order": $(this).children('a').attr('href')
                    }).then((_) => {}, (error) => {
                        if (error) {
                            throw error;
                        }
                    });
                });
                modelOrder.find({}).then((data) => {
                    getAnimes(orders);
                }, (error) => {});
            });
        } else {
            getAnimes(data);
        }
    }, (error) => {
        if (error) {
            throw error;
        }
    });
}

function getAnimes(orders) {
    modelAnime.find({}).then((data) => {
        console.log('#LOG Retrive animes: ' + data.length);
        if (data.length == 0) {
            console.log('#LOG Start get animes');
            var i = 0
            var interval = setInterval(() => {
                if (i < orders.length - 1) {
                    console.log('Fetching ----> ' + orders[i].order);
                    request(orders[i].order, (error, response, body) => {
                        if (error) {
                            throw error;
                        }
                        const $ = loadBody(body);
                        var aux = new Array();
                        $('body').children('home').children('div').children('div').children().children('ul').children('li').each(function (index, row) {
                            var anime = {
                                orderId: orders[i]._id,
                                nome: $(this).children('a').children('p').children('h3').text(),
                                link: $(this).children('a').attr('href'),
                                imagem: $(this).children('img').attr('data-src'),
                                ano: "",
                                sinopse: "",
                                categorias: ""
                            };
                            aux[index] = anime;
                        });
                        aux.forEach(function (item) {
                            modelAnime.create(item).then(() => {}, (error) => {
                                if (error) {
                                    throw error;
                                }
                            });
                        });
                    });
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        } else {
            getAnimeEpisodes(data);
        }
    }, (error) => {
        if (error) {
            throw error;
        }
        console.log(data.length);
    });
}

function getAnimeEpisodes(animes) {
    modelEpisode.find({}).then((data) => {
        console.log('#LOG Retrive episodes: ' + data.length);
        if (data.length == 0) {
            console.log('#LOG Start get animes episodes');
            var i = 0
            var interval = setInterval(() => {
                if (i < animes.length - 1) {
                    console.log('Fetching ----> ' + animes[i].link);
                    request(animes[i].link, (error, response, body) => {
                        if (error) {
                            throw error;
                        }
                        const $ = loadBody(body);
                        var aux = new Array();

                        var anime = animes[i];
                        anime.ano = $('body').children('home').children('div').children().children().next().text().match(/([0-9])\w+/g)[0];
                        anime.categorias = $('body').children('home').children('div').children().children().next().text().match(/(Categorias: )(.*)(?= Sinopse: )/);
                        modelAnime.findByIdAndUpdate(anime._id, anime, {new: true}, function(err, model) {});

                        // console.log($('body').children('home').children('div').children().children().next().children().next().text());
                        $('body').children('home').children('div').children().next().children().next().children('ul').children('li').each(function (index, row) {
                            var link = $(this).children('p').children('a').attr('href')
                            var episode = {
                                animeId: animes[i]._id,
                                link: link,
                                numero: link.substring(link.length-2)
                            }
                            aux[index] = episode;
                        });
                        aux.forEach(function (item) {
                            modelEpisode.create(item).then((_) => {}, (error) => {
                                if (error) {
                                    throw error;
                                }
                            });
                        });
                    });
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        } else {
            getEpisodesLink(data);
        }
    }, (error) => {
        if (error) {
            throw error;
        }
        console.log(data.length);
    });
}

function getEpisodesLink(episodes) {
    modelEpisodeLink.find({}).then((data) => {
        console.log('#LOG Retrive links: ' + data.length);
        if (data.length == 0) {
            console.log('#LOG Start get animes episodes links');
            var i = 0
            var interval = setInterval(() => {
                if (i < episodes.length - 1) {
                    console.log('Fetching ----> ' + episodes[i].link);
                    console.log(episodes[i]);
                    request(episodes[i].link, (error, response, body) => {
                        if (error) {
                            throw error;
                        }
                        const $ = loadBody(body);
                        var aux = new Array();
                        $('video').children('source').each(function (index, row) {
                            aux[index] = ($(this).attr('src'));
                        });
                        var episodeLink = {
                            episodeId: episodes[i]._id,
                            link1: aux[0],
                            link2: aux[1]
                        };
                        modelEpisodeLink.create(episodeLink).then((_) => {}, (error) => {
                            if (error) {
                                throw error;
                            }
                        });
                    });
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }, (error) => {
        if (error) {
            throw error;
        }
        console.log(data.length);
    });
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