var mongoose = require('mongoose');

var schema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.ObjectId,
        require: true,
		ref: 'Order'
	},
    nome: {
        type: String,
        unique: true,
        required: true
    },
    link: {
        type: String,
        unique: true,
        required: true
    },
    imagem: {
        type: String,
        unique: true,
        required: true
    },
    ano: {
        type: String
    },
    sinopse: {
        type: String
    },
    categorias: {
        type: String
    }
});

mongoose.model('Anime', schema);