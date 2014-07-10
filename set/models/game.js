var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var GameSchema = new Schema({
	playerState : {name : String, score : Number}
	boardState : [{card : String}]
	deckState : [{card : String}]
});

module.exports = mongoose.model('GameModel', GameSchema);