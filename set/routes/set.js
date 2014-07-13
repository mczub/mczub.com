var mongoose = require('mongoose'),
	game = require('../models/game.js');
module.exports = SetGame;

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]


function SetGame(connection) {
	mongoose.createConnection(connection);
};

SetGame.prototype = {
	playGame: function(req,res) {
		res.render('index',{title:'gamez'});
	},
	newGame: function(data, idfn){
		var player = data.player;
		var board = [];
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
		newGame.deckState = shuffle(board);
		newGame.boardState = newGame.deckState.splice(0,12);
		newGame.save(function savedGame(err, obj){
			if (err){
				throw err;
			}
			idfn(obj);
		});
		//res.redirect('../');
	},
	drawCard: function(id, num, status, idfn){
		game.findById(id,function (err, thisGame) {
			if (thisGame.deckState.length < num)
			{
				status("Not enough cards!");
				return;
			}
			else if (thisGame.boardState.length >= 18)
			{
				status("Too many cards on the board.");
				return;
			}
			else
			{
				status("Got " + num + " new cards.");
			}
			var newBoard = thisGame.boardState.concat(thisGame.deckState.splice(0,num));
			thisGame.boardState = newBoard;

			thisGame.save(function savedGame(err, obj){
				if (err){
					throw err;
				}
				idfn(obj)
			});
		});
		
	}
};

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};