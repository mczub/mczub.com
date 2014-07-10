/*var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes');
//var users = require('./routes/user');
//var GameList = require('./routes/set');
//var connectStr = process.env.APPSETTING_MONGOLAB_URI;
//var gameList = new GameList(connectStr);
//var gameList = new GameList('localhost');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

//app.get('/', routes.index);
//app.get('/', gameList.showAllGames.bind(gameList));
//app.post('/newGame', gameList.newGame.bind(gameList));
//app.get('/users', users.list);

var port = process.env.port || 1337;
var server = app.listen(port,function(){
    console.log('listening on port %d', server.address().port);
});

app.get('/', function(req, res){
    res.send('Hello World');
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error("Could not connect to DB");
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
*/

var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

var port = process.env.port || 1337;
var server = app.listen(port,function(){
    console.log('listening on port %d', server.address().port);
});