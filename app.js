const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const favicon = require('serve-favicon'); // this is for the little icon up top in chrome

const app = express();
// importing and initializing socket.io server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require('dotenv').config();

// setting up imported packages
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// set up static files and favicon
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/favicon.ico')); // for finding the favicon

// set up views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// socket.io chat server functionality
let users = {};

io.on('connection', function(socket) {
  let username = socket.handshake.query.username;
  socket.emit('welcome', {users: users, greeting: `hello ${username}!`});
  socket.broadcast.emit('new user', `${username} has joined`);

  users[socket.id] = username;
  console.log(users);
  console.log('new connection from ' + socket.id + ', also known as ' + users[socket.id]);

  socket.on('chat message', function(message) {
    // console.log('message: ' + message);
    if (message === '>userlist') {
      socket.emit('list users', users);
    } else {
      socket.emit('chat message', {username: users[socket.id], message: message});
      socket.broadcast.emit('chat message', {username: users[socket.id], message: message});
    };
  });

  socket.on('disconnect', function() {
    console.log(socket.id + ' (AKA ' + users[socket.id] +') disconnected');
    socket.broadcast.emit('user left', users[socket.id] + ' has left!')
    delete users[socket.id];
    console.log(users);
  });
});

// thanks to Ramsey for pointing out that app.listen don't cut it for socket.io
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`You're tuned in to port ${port}!`);
});

const authHelpers = require('./services/auth/auth-helpers');

// chat route
app.get('/chat', authHelpers.loginRequired, (req, res) => {
  res.render('chat', {
    message: 'ok',
    user: req.user,
    currentPage: 'chat',
  });
});

// index route
app.get('/', (req, res) => {
  res.render('index', {
      message: '“We need to make books cool again. If you go home with somebody and they don\'t have books, don\'t fuck them.”',
      currentPage: 'home',
      documentTitle: 'The Reading List',
      subTitle: '- John Waters',
      user: req.user,
  });
});

// routes
const bookRoutes = require('./routes/book-routes');
app.use('/books', bookRoutes);
const authRoutes = require('./routes/auth-routes');
app.use('/auth', authRoutes);
const userRoutes = require('./routes/user-routes');
app.use('/user', userRoutes);

app.get('*', (req, res) => {
    res.status(404).send('Four-Oh-Four, not found! Ell-Oh-Ell!')
});