var mongoose = require('mongoose');

module.exports = function (app) {

    var api = {};

    var modelOrder = mongoose.model('Order');
    var modelAnime = mongoose.model('Anime');
    var modelEpisode = mongoose.model('Episode');
    var modelEpisodeLink = mongoose.model('EpisodeLink');

    api.getOrderList = function (req, res) {
        modelOrder.find({}).sort({word : 'asc'}).then(function (data) {
            res.status(200).send({
                success: true,
                data: data
            });
        }, function (error) {
            res.status(500).send({
                success: false,
                message: error
            });
            console.log(error);
        });
    };

    api.getAnimeByOrderId = function (req, res) {
        if (req.query.orderId != null) {
            modelAnime.find({orderId : req.query.orderId}).sort({nome : 'asc'}).then(function (data) {
                res.status(200).send({
                    success: true,
                    data: data
                });
            }, function (error) {
                res.status(500).send({
                    success: false,
                    message: error
                });
                console.log(error);
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'You need to provide an orderId.'
            });
        }
    };

    api.getAnimeByName = function (req, res) {
        if (req.query.animeName != null) {
            modelAnime.find({nome : new RegExp(req.query.animeName, "i")}).sort({nome : 'asc'}).then(function (data) {
                res.status(200).send({
                    success: true,
                    data: data
                });
            }, function (error) {
                res.status(500).send({
                    success: false,
                    message: error
                });
                console.log(error);
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'You need to provide an animeName.'
            });
        }
    };

    api.getEpisodeByAnimeId = function (req, res) {
        if (req.query.animeId != null) {
            modelEpisode.find({animeId : req.query.animeId}).sort({numero : 'asc'}).then(function (data) {
                res.status(200).send({
                    success: true,
                    data: data
                });
            }, function (error) {
                res.status(500).send({
                    success: false,
                    message: error
                });
                console.log(error);
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'You need to provide an animeId.'
            });
        }
    }

    api.getEpisodeLinkByEpisodeId = function (req, res) {
        if (req.query.episodeId != null) {
            modelEpisodeLink.findOne({episodeId : req.query.episodeId}).then(function (data) {
                res.status(200).send({
                    success: true,
                    data: data
                });
            }, function (error) {
                res.status(500).send({
                    success: false,
                    message: error
                });
                console.log(error);
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'You need to provide an episodeId.'
            });
        }
    }

    return api;
};