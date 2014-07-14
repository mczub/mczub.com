var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sio = require('socket.io');

var routes = require('./routes');
var users = require('./routes/user');
var GameList = require('./routes/status');
var SetGame = require('./routes/set');
var connectStr = 'localhost';
if (process.env.IISNODE_VERSION) {
    connectStr = process.env.APPSETTING_MONGOLAB_URI;
}
//var gameList = new GameList('localhost');
//var setGame = new SetGame('localhost');
var gameList = new GameList(connectStr);
var setGame = new SetGame(connectStr);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('env', 'development')

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use('/set',express.static(path.join(__dirname, 'public')));
app.use(app.router);

//app.get('/', routes.index);

app.get('/set', setGame.playGame.bind(setGame));
app.post('/set/newGame', gameList.newGame.bind(gameList));
app.get('/set/users', users.list);
app.get('/set/status', gameList.showAllGames.bind(gameList));

var port = process.env.PORT || 1337;
/*var server = app.listen(port,function(){
    console.log('listening on port %d', server.address().port);
});*/



var ioserver = http.Server(app);
var io = sio(ioserver);
ioserver.listen(port);
//config to work in azure subdirectory
//io.set('transports', [ 'websocket' ]);
if (process.env.IISNODE_VERSION) {
    io.set('resource', '/set/socket.io');
}

function sendState(gameData){
    io.sockets.emit('boardState', {
        id: gameData._id, 
        score: gameData.playerState.score, 
        boardState: gameData.boardState,
        cardsLeft: gameData.deckState.length + gameData.boardState.length
    });
}

io.on('connection', function(socket){
    //socket.emit('announcement', 'Server connected.');
    console.log('socket.io client connected.');
    socket.on('message', function(data)
    {
        io.sockets.emit('message',{message: data.message});
        console.log(data.message);
    });
    socket.on('newGame', function(data)
    {
        setGame.newGame({player: data.player}, function(gameData)
            {
                io.sockets.emit('message',{message: data.player +" started new game id:" + gameData._id});
                sendState(gameData);
            });
        console.log(data.player + " started new game");
    });
    socket.on('noSet', function(data)
    {
        setGame.drawCard(data.id, 3, function(status){
            io.sockets.emit('status', {message: status});
        },
        function(gameData){
            sendState(gameData)
        });
    });
    socket.on('makeSet', function(data)
    {
        setGame.makeSet(data, function(status){
            io.sockets.emit('status', {message: status});
        },
        function(gameData){
            sendState(gameData)
        });
    })
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error("Could not connect");
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;