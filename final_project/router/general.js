const express = require('express');
const axios = require('axios'); // kept for requirement

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


/**
 * Register a new user
 */
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


/**
 * Get all books (async simulation)
 */
public_users.get('/', async (req, res) => {
  try {
    const response = await Promise.resolve({ data: books });
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


/**
 * Get book by ISBN
 */
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await Promise.resolve({ data: books });
    const data = response.data;

    if (data[isbn]) {
      return res.status(200).json(data[isbn]);
    }

    return res.status(404).json({ message: "Book not found" });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});


/**
 * Get books by author (case-insensitive)
 */
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const response = await Promise.resolve({ data: books });
    const data = response.data;

    const filteredBooks = Object.values(data).filter(
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
 * Get books by title (case-insensitive)
 */
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const response = await Promise.resolve({ data: books });
    const data = response.data;

    const filteredBooks = Object.values(data).filter(
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
 * Get book reviews
 */
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await Promise.resolve({ data: books });
    const data = response.data;

    if (!data[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    const reviews = data[isbn].reviews;

    // Handle empty reviews properly
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
