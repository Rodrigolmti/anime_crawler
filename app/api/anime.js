var mongoose = require('mongoose');

module.exports = function (app) {

    var api = {};

    var modelOrder = mongoose.model('Order');
    var modelAnime = mongoose.model('Anime');
    var modelEpisode = mongoose.model('Episode');
    var modelEpisodeLink = mongoose.model('EpisodeLink');

    api.getOrderList = function (req, res) {
        modelOrder.find({}).then(function (data) {
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

    api.getAnimeByOrder = function (req, res) {
        if (req.query.orderId != null) {
            modelAnime.find({orderId : req.query.orderId}).then(function (data) {
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

    api.getEpisodeByAnimeId = function (req, res) {
        if (req.query.animeId != null) {
            modelEpisode.find({animeId : req.query.animeId}).then(function (data) {
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