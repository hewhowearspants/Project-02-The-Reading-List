const bcrypt = require('bcryptjs');
const User = require('../models/user.js');

const usersController = {};

usersController.create = (req, res) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  User.create({
    username: req.body.username,
    email: req.body.email,
    password_digest: hash,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  }).then((user) => {
    req.login(user, (err) => {
      if(err) {
        return next(err);
      };
      res.redirect('/books');
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({error: err});
  });
};

usersController.index = (req, res) => {
  User.findByUserName(req.user.username)
    .then((user) => {
      res.render('user/user-profile', {
        currentPage: 'user',
        message: 'ok',
        user: user,
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({error: err});
    });
};

usersController.edit = (req, res) => {
  User.findByUserName(req.user.username)
    .then((user) => {
      res.render('user/user-profile-edit', {
        currentPage: 'user edit',
        message: 'ok',
        user: user,
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({error: err});
    });
};

usersController.update = (req, res) => {
  User.update({
    username: req.body.username,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    id: req.user.id,
  }).then((user) => {
    res.redirect('/user');
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
};

module.exports = usersController;