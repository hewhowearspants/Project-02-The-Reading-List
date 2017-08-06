// PSQL database queries for 'users' table

const db = require('../db/config');

const User = {};

User.findByUserName = (username) => {
  return db.oneOrNone(`
    SELECT * FROM users
    WHERE username = $1
  `, [username]);
};

User.create = (user) => {
  return db.one(`
    INSERT INTO users
    (username, email, password_digest, firstname, lastname)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *
  `, [user.username, user.email, user.password_digest, user.firstname, user.lastname]);
};

User.update = (user) => {
  return db.one(`
  UPDATE users SET
  username = $1,
  email = $2,
  firstname = $3,
  lastname = $4
  WHERE id = $5
  RETURNING *
  `, [user.username, user.email, user.firstname, user.lastname, user.id]);
};

User.changePassword = (user) => {
  return db.one(`
  UPDATE users SET
  password_digest = $1
  WHERE id = $2
  RETURNING *
  `, [user.password_digest, user.id]);
};

module.exports = User;