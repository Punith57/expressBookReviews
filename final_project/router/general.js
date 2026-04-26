const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ✅ REGISTER
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});


// ✅ GET ALL BOOKS (ASYNC)
public_users.get('/', async (req, res) => {
  try {
    // simulate async using axios
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// ✅ GET BOOK BY ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({ message: "Book not found" });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});


// ✅ GET BOOKS BY AUTHOR
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    const filteredBooks = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    }

    return res.status(404).json({ message: "No books found for this author" });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// ✅ GET BOOKS BY TITLE
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    const filteredBooks = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    }

    return res.status(404).json({ message: "No books found with this title" });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// ✅ GET BOOK REVIEWS
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({ message: "Book not found" });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching reviews" });
  }
});


module.exports.general = public_users;

