var socket = io.connect(address, details);
var thisID;
var mySocketID = socket.id;
var playerName;
var isGuest;

$(window).load(function(){
	if (localStorage.getItem('name') === null){
		$('#nameModal').modal('show');
	}else{
		isGuest = false;
		newGame(isGuest);
	}
	
});
$(document).on("click", ".card", function(){
	clickedCard($(this));
});
$(document).on("click", "#play", function(){
	localStorage.name = $("#player").val();
	isGuest = false;
	newGame(isGuest);
});
$(document).on("click", "#playGuest", function(){
	localStorage.clear('name');
	isGuest = true;
	newGame(isGuest);
});
$(document).on("click", "#editName", function(){
	$('#newGameModal').modal('show');
});
$(document).on("click", "#rename", function(){
	$('#newGameModal').modal('hide');
	localStorage.clear('name');
	$('#nameModal').modal('show');
});


socket.on('message', function(data)
{
	displayMessage("message: " + data.message);
});
socket.on('boardState', function(data)
{
	//displayMessage(data.boardState[1].card);
	updateGameID(data.id);
	updateScore(data.score, data.cardsLeft);
	thisID = data.id;
	redraw(data.boardState);
});
socket.on('status', function(data)
{
	displayStatus(data.message);
});
function sendMessage()
{
	socket.emit('message', {message: $("#mbox").val()});
};
function displayMessage(message)
{
	$("#output").append(message + "<br/>");
};
function newGame(guest)
{
	if(guest) { 
		playerName = ''; 
		$('#name').html("Playing as Guest");
	}else { 
		playerName = localStorage.name;
		$('#name').html("Name: <b>"+playerName+"</b>");
	}
	$('#name').append("   <a><span class='glyphicon glyphicon-pencil' id='editName'> </span></a>");
	socket.emit('newGame', {player: playerName});
	$('#nameModal').modal('hide');
};
function newGameGuest()
{
	playerName = '';
	socket.emit('newGame', {player: playerName});
	$('#nameModal').modal('hide')
	
};
function updateGameID(gameid){
	$("#gameid").html("Game ID: <b>"+gameid+"</b>");
};
function updateScore(score, cardsLeft){
	$("#score").html("Score: <b>"+score+"</b>");
	$("#cardsLeft").html("Cards Remaining: <b>"+cardsLeft+"</b>");

};

function redraw(board){
	var allcells = $('#setTable td');
	if (allcells.length > board.length){
		for (var j = board.length; j < allcells.length; j++){
			allcells.eq(j).empty();
		};
	};
	for (var j = 0; j < board.length; j++){
		var pic = document.createElement("img");
		pic.src = "/set/images/" + board[j].card +".png";
		pic.alt = j;
		pic.id = board[j].card;
		pic.className="card";
		//pic.setAttribute("onclick","clickedCard(this);");
		var cells = $('#setTable td');
		var cards = $('#setTable td img')
		var children = cells[j].childNodes;
		if (cells[j].childNodes[0] != null){
			if (cells[j].childNodes[0].id === pic.id){ continue; }
			cells[j].removeChild(cells[j].childNodes[0]);
		}
		cells[j].appendChild(pic);
	};

}

function clickedCard(obj)
{
	$(obj).toggleClass('selected');
	var selectedCards = $('.selected');
	if (selectedCards.length == 3){
		var selCardText = [];
		selCardText.push(selectedCards[0].id);
		selCardText.push(selectedCards[1].id);
		selCardText.push(selectedCards[2].id);
		socket.emit('makeSet', {id: thisID, set: selCardText});
	}
}

function displayStatus(status){
	$("#status").show();
	$("#status").html(status);
}

function noSet(){
	socket.emit('noSet', {id: thisID});
}
