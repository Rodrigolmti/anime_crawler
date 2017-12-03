module.exports = function (app) {

    var apiAuthentication = app.api.authentication;
    var anime = app.api.anime;

    // app.use(apiAuthentication.checkToken);

    app.route('/api/v1/orderList')
        .get(anime.getOrderList);

    app.route('/api/v1/animeByOrderId')
        .get(anime.getAnimeByOrder);

    app.route('/api/v1/episodeByAnimeId')
        .get(anime.getEpisodeByAnimeId);

    app.route('/api/v1/episodeLinkByEpisodeId')
        .get(anime.getEpisodeLinkByEpisodeId);
};