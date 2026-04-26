const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


/**
 * Register a new user
 * Validates input and ensures username is unique
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Check if user already exists
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Add new user
  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});


/**
 * Get all books
 * Uses Axios to simulate asynchronous data retrieval
 */
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


/**
 * Get book details by ISBN
 */
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


/**
 * Get books by author name
 * Case-insensitive filtering
 */
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


/**
 * Get books by title
 * Case-insensitive filtering
 */
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


/**
 * Get reviews for a specific book
 * Handles empty review cases clearly
 */
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    const reviews = books[isbn].reviews;

    if (!reviews || Object.keys(reviews).length === 0) {
      return res.status(200).json({
        message: "No reviews found for this book"
      });
    }

    return res.status(200).json({
      reviews: reviews
    });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching reviews" });
  }
});


module.exports.general = public_users;
