\c reading_list_dev

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_digest TEXT NOT NULL,
    firstname VARCHAR(255),
    lastname VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    year INTEGER,
    genre VARCHAR(255),
    description TEXT,
    read BOOLEAN,
    user_id INTEGER REFERENCES users(id),
    user_rating INTEGER,
    user_notes TEXT
);