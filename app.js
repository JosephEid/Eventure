/**
 * Load node modules
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var storiesRouter = require('./routes/stories');

/**
 * Start the application server and the socket io server.
 */
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(3001);

// Server side socket io functions, these include a client connecting, a client joining a room and a client sending a message to a room.
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('join', function(room){
    socket.join(room);
  });
  socket.on('chat message', function(room, msg){
    io.to(room).emit('chat message', msg);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// sets the app to use sessions
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

// app settings
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ limit:'50mb', extended: true }));
app.use(bodyParser({limit: '50mb'})); //Allows for storage of images
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', eventsRouter);
app.use('/', storiesRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
