var mongoose = require('mongoose');

var schema = mongoose.Schema({
    animeId: {
        type: mongoose.Schema.ObjectId,
        require: true,
		ref: 'Anime'
	},
    link: {
        type: String,
        required: true,
        unique: true
    }
});

mongoose.model('Episode', schema);