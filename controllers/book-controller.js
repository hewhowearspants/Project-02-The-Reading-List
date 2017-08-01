const Book = require('../models/book');

const bookController = {};

bookController.index = (req, res) => {
  Book.findAll()
    .then((books) => {
      let userBooks = books.filter((book) => {
        return book.user_id === req.user.id;
      });
      let readBooks = userBooks.filter((book) => {
        return book.read;
      });
      let unreadBooks = userBooks.filter((book) => {
        return !book.read;
      });
      res.render('books/book-index', {
        currentPage: 'index',
        message: 'ok',
        books: userBooks,
        unreadBooks: unreadBooks,
        readBooks: readBooks,
        user: req.user,
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

bookController.show = (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      res.render('books/book-single', {
        currentPage: 'show',
        message: 'ok',
        book: book,
        user: req.user,
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

bookController.create = (req, res) => {
  Book.create({
    title: req.body.title,
    author: req.body.author,
    year: req.body.year,
    genre: req.body.genre,
    description: req.body.description,
    read: false,
    userId: req.user.id,
  }).then((book) => {
    res.redirect('/books');
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
};

bookController.update = (req, res) => {
  Book.update({
    title: req.body.title,
    author: req.body.author,
    year: req.body.year,
    genre: req.body.genre,
    description: req.body.description,
  }, req.params.id).then((book) => {
    res.redirect(`/books/${req.params.id}`);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
};

bookController.edit = (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      res.render('books/book-single-edit', {
        currentPage: 'edit',
        book: book,
        user: req.user,
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

bookController.markRead = (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      res.render('books/book-mark-read', {
        currentPage: 'done',
        book: book,
        user: req.user,
      })
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
  });
};

bookController.userRate = (req, res) => {
  Book.userRate({
    userRating: req.body.rating,
    userNotes: req.body.notes,
  }, req.params.id).then(() => {
    res.redirect(`/books/${req.params.id}`);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
};

bookController.markUnread = (req, res) => {
  Book.userUnrate(req.params.id)
    .then(() => {
      res.redirect(`/books`);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    })
};

bookController.delete = (req, res) => {
  Book.destroy(req.params.id)
    .then(() => {
      res.redirect('/books');
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

bookController.sendBookstores = (req, res) => {
  Book.findAll()
    .then((books) => {
      let stores = res.locals.stores;
      console.log('found ' + res.locals.stores.length + ' bookstores!');
      res.render('books/book-stores', {
        currentPage: 'stores',
        message: 'ok',
        stores: stores,
        user: req.user,
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    })
};

bookController.sendBooks = (req, res) => {
  Book.findAll()
    .then((books) => {
      let bookResults = res.locals.books;
      console.log('found ' + res.locals.books.length + ' books!');
      res.render('books/book-search', {
        currentPage: 'search-results',
        message: 'ok',
        books: bookResults,
        user: req.user,
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    })
};

module.exports = bookController;