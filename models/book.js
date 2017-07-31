const db = require('../db/config');

const Book = {};

Book.findAll = () => {
  return db.query('SELECT * FROM books ORDER BY id ASC');
};

Book.findById = (id) => {
  return db.oneOrNone(`
    SELECT * FROM books
    WHERE id = $1
  `, [id]);
};

Book.create = (book) => {
  return db.one(`
    INSERT INTO books
    (title, author, year, genre, read, user_id)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [book.title, book.author, book.year, book.genre, book.read, book.userId]);
};

Book.update = (book, id) => {
  return db.one(`
    UPDATE books SET
    title = $1,
    author = $2,
    year = $3,
    genre = $4,
    read = $5,
    WHERE id = $6
    RETURNING *
  `, [book.title, book.author, book.year, book.genre, book.read, id]);
};

Book.destroy = (id) => {
  return db.none(`
    DELETE FROM books
    WHERE id = $1
  `, [id]);
};

module.exports = Book;