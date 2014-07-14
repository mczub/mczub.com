var socket = io.connect(address, details);
var thisID;

$(document).on("click", ".card", function(){
	clickedCard($(this));
});

socket.on('message', function(data)
{
	displayMessage("message: " + data.message);
});
socket.on('boardState', function(data)
{
	//displayMessage(data.boardState[1].card);
	updateGameID(data.id);
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
function newGame()
{
	socket.emit('newGame', {player: $("#player").val()});
};
function updateGameID(gameid){
	$("#gameid").html("Game ID: <b>"+gameid+"</b>");
};

function redraw(board){
	var allcells = $('#setTable td');
	allcells.empty();
	for (var j = 0; j < board.length; j++){
		var pic = document.createElement("img");
		pic.src = "/set/images/" + board[j].card +".png";
		pic.alt = j;
		pic.id = board[j].card;
		pic.className="card";
		//pic.setAttribute("onclick","clickedCard(this);");
		var cells = $('#setTable td');
		var children = cells[j].childNodes;
		if (cells[j].childNodes[0] != null) cells[j].removeChild(cells[j].childNodes[0]);
		cells[j].appendChild(pic);
	}
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
