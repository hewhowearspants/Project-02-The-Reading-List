const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const app = express();

require('dotenv').config();

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

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`You're tuned in to port ${port}!`);
});

app.get('/', (req, res) => {
    res.render('index', {
        message: 'Make America Read Again!',
        currentPage: 'home',
        documentTitle: 'The Reading List',
        subTitle: 'R-E-A-D, A, B-O, O-kaayyyyyy!!',
        user: req.user,
    });
});

const bookRoutes = require('./routes/book-routes');
app.use('/books', bookRoutes);
const authRoutes = require('./routes/auth-routes');
app.use('/auth', authRoutes);
const userRoutes = require('./routes/user-routes');
app.use('/user', userRoutes);

app.get('*', (req, res) => {
    res.status(404).send('Four-Oh-Four, not found! Ell-Oh-Ell!')
});