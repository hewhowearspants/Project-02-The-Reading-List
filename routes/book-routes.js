const express = require('express');
const bookRoutes = express.Router();

const bookController = require('../controllers/book-controller');
const authHelpers = require('../services/auth/auth-helpers');

bookRoutes.get('/', authHelpers.loginRequired, bookController.index);
bookRoutes.post('/', authHelpers.loginRequired, bookController.create);

bookRoutes.get('/add', authHelpers.loginRequired, (req, res) => {
  res.render('books/book-add', {
    currentPage: 'add',
    user: req.user,
  });
});

bookRoutes.get('/:id', authHelpers.loginRequired, bookController.show);
bookRoutes.get('/:id/edit', authHelpers.loginRequired, bookController.edit);
bookRoutes.get('/:id/done', authHelpers.loginRequired, bookController.markRead);
bookRoutes.put('/:id/done', authHelpers.loginRequired, bookController.userRate);
bookRoutes.get('/:id/not-done', authHelpers.loginRequired, bookController.markUnread);
bookRoutes.put('/:id', authHelpers.loginRequired, bookController.update);
bookRoutes.delete('/:id', authHelpers.loginRequired, bookController.delete);

module.exports = bookRoutes;