var mongoose = require('mongoose'),
	game = require('../models/game.js');

module.exports = GameStatus;

function GameStatus(connection) {
	mongoose.connect(connection);
}

GameStatus.prototype = {
	showAllGames: function(req,res) {
		game.find({}, function gotGames(err, items){
			res.render('status',{title:'gamez', games: items})
		});
	},
	newGame: function(data, idfn){
		var player = data.player;
		var board;
		newGame = new game();
		newGame.playerState.name = player;
		newGame.playerState.score = 0;
		for (var num = 1; num <=3; num++){
			for (var shape = 1; shape <= 3; shape++){
				for (var shade = 1; shade <= 3; shade++){
					for (var color = 1; color <= 3; color++){
						board.push({card: num + '' + shape + '' + shade + '' + color});
					}
				}
			}
		}
		newGame.boardState = shuffle(board);
		newGame.save(function savedGame(err, obj){
			if (err){
				throw err;
			}
			idfn(obj);
		});
		//res.redirect('../');
	},
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};