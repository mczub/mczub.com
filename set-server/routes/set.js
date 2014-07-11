var mongoose = require('mongoose'),
	game = require('../models/game.js');

module.exports = SetGame;

function SetGame(connection) {
	mongoose.connect(connection);
}

SetGame.prototype = {
	showAllGames: function(req,res) {
		game.find({}, function gotGames(err, items){
			res.render('index',{title:'gamez', games: items})
		});
	},
	newGame: function(req,res){
		var player = req.body.player;
		newGame = new game();
		newGame.playerState.name = player;
		newGame.playerState.score = 0;
		newGame.boardState = [{card : '1111'}, {card : '2222'}, {card : '3333'}];
		newGame.save(function savedGame(err){
			if (err){
				throw err;
			}
		});
		res.redirect('../');
	},
}