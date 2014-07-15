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
		
	},
	makeSet: function(data, status, board){
		game.findById(data.id, function(err, thisGame){
			var theBoard = thisGame.boardState;
			var theDeck = thisGame.deckState;
			for (var j = 0; j <= 2; j++){
				if (!containsCard(theBoard, data.set[j])){
					status("Could not find card.");
					return;
				}
				//console.log(theBoard);
				//console.log({card: data.set[j]});
			}
			if (!isASet(data.set)){
				status("Not a set.");
				return;
			}
			for (var j = 0; j <= 2; j++){
				if (theBoard.length <= 12 && theDeck.length > 0){
					console.log(theBoard);
					replaceCard(theBoard, data.set[j], theDeck.splice(0,1)[0].card);
					console.log(theBoard);
				}else{
					removeCard(theBoard, data.set[j]);
				}
				
			}
			thisGame.boardState = theBoard;
			thisGame.deckState = theDeck;
			thisGame.playerState.score++;
			status("Made a set!")
			thisGame.save(function savedGame(err, obj){
				if (err){
					throw err;
				}
				board(obj)
			});
		});
	}
};

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function xform(doc,ret,options){
	delete ret._id;
};

function containsCard(board, card){
	var i = board.length;
	while (i--){
		if (board[i].card === card){
			return true;
		}
	}
	return false;
}

function removeCard(board, card){
	var i = board.length;
	while (i--){
		if (board[i].card === card){
			board.splice(i,1);
		}
	};
}

function replaceCard(board, oldCard, newCard)
{
	var i = board.length;
	while (i--){
		if (board[i].card === oldCard){
			board[i].card = newCard;
		}
	}
}

function isASet(cards){
	return true;
}