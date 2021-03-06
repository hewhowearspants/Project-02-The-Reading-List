const express = require('express');
const bookRoutes = express.Router();

const bookController = require('../controllers/book-controller');
const authHelpers = require('../services/auth/auth-helpers');
const bookHelpers = require('../services/book/book-helpers');

bookRoutes.get('/', authHelpers.loginRequired, bookController.index);
bookRoutes.post('/', authHelpers.loginRequired, bookController.create);

bookRoutes.get('/add', authHelpers.loginRequired, (req, res) => {
  res.render('books/book-add', {
    currentPage: 'add',
    user: req.user,
  });
});

// routes for getting info from APIs
bookRoutes.get('/stores/:zip', bookHelpers.getGeocode, bookHelpers.getBookstores, bookController.sendBookstores);
bookRoutes.get('/search/:query', bookHelpers.getBooks, bookController.sendBooks);
bookRoutes.get('/search/:query/:id', bookHelpers.getBooks, bookController.showFromSearch);
// add book to list from API search results
bookRoutes.post('/search/:query/:id', authHelpers.loginRequired, bookHelpers.getBooks, bookController.createFromSearch);

// show book info and edit
bookRoutes.get('/:id', authHelpers.loginRequired, bookController.show);
bookRoutes.get('/:id/edit', authHelpers.loginRequired, bookController.edit);

// routes for making book as read and unread
bookRoutes.get('/:id/done', authHelpers.loginRequired, bookController.markRead);
bookRoutes.put('/:id/done', authHelpers.loginRequired, bookController.userRate);
bookRoutes.get('/:id/not-done', authHelpers.loginRequired, bookController.markUnread);

bookRoutes.put('/:id', authHelpers.loginRequired, bookController.update);

bookRoutes.delete('/:id', authHelpers.loginRequired, bookController.delete);

module.exports = bookRoutes;