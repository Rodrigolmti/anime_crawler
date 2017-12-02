var mongoose = require('mongoose');

var schema = mongoose.Schema({
    episodeId: {
        type: mongoose.Schema.ObjectId,
        require: true,
		ref: 'Episode'
	},
    link1: {
        type: String,
        required: true,
        unique: true
    },
    link2: {
        type: String,
        required: true,
        unique: true
    }
});

mongoose.model('EpisodeLink', schema);