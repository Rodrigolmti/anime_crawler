var mongoose = require('mongoose');

var schema = mongoose.Schema({
    order: {
        type: String,
        required: true,
        unique: true
    }, 
    word: {
        type: String,
        required: true,
        unique: true
    }
});

mongoose.model('Order', schema);