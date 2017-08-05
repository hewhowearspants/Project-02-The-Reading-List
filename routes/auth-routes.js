const express = require('express');
const authRouter = express.Router();
const passport = require('../services/auth/local');
const authHelpers = require('../services/auth/auth-helpers');
const usersController = require('../controllers/users-controller');

authRouter.get('/login', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/login', {
    currentPage: 'login',
    user: req.user,
  });
});

authRouter.get('/register', authHelpers.loginRedirect, (req,res) => {
  res.render('auth/register', {
    currentPage: 'register',
    user: req.user,
  });
});

authRouter.post('/register', usersController.create);

authRouter.post('/login', function (req, res, next) {  
  console.log(req.session.returnTo);
  passport.authenticate('local', {
    successRedirect: req.session.returnTo || '/books',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })(req, res, next);
  delete req.session.returnTo;
});

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = authRouter;