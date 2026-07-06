const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password are required."});
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(404).json({message: "User already exists!"});
  }

  users.push({username: username, password: password});
  return res.status(200).json({message: "User successfully registered. Now you can login."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get the book list using async/await with Axios (Q11 requirement)
public_users.get('/async-books', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({message: "Error retrieving books", error: error.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on ISBN using Promises with Axios (Q11 requirement)
public_users.get('/isbn-promise/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.status(500).json({message: "Error retrieving book", error: error.message});
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  for (let isbn in books) {
    if (books[isbn].author === author) {
      matchingBooks.push(books[isbn]);
    }
  }
  res.send(matchingBooks);
});

// Get book details based on author using async/await with Axios (Q11 requirement)
public_users.get('/author-async/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({message: "Error retrieving books", error: error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];
  for (let isbn in books) {
    if (books[isbn].title === title) {
      matchingBooks.push(books[isbn]);
    }
  }
  res.send(matchingBooks);
});

// Get all books based on title using Promises with Axios (Q11 requirement)
public_users.get('/title-promise/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.status(500).json({message: "Error retrieving books", error: error.message});
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;