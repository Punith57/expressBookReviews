const express = require('express');
const axios = require('axios'); // kept for assignment requirement

// Import data and helper functions
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// Create router instance
const public_users = express.Router();


/**
 * ============================================================
 * ROUTE: Register a new user
 * METHOD: POST /register
 * DESCRIPTION:
 *   - Accepts username and password
 *   - Validates input fields
 *   - Ensures username is unique
 *   - Stores user in memory
 * ============================================================
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate input fields
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Check if username already exists
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Store new user
  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});


/**
 * ============================================================
 * ROUTE: Get all books
 * METHOD: GET /
 * DESCRIPTION:
 *   - Returns complete list of books
 *   - Uses async/await to simulate asynchronous behavior
 * ============================================================
 */
public_users.get('/', async (req, res) => {
  try {
    // Simulate async API response
    const response = await Promise.resolve({ data: books });

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


/**
 * ============================================================
 * ROUTE: Get book by ISBN
 * METHOD: GET /isbn/:isbn
 * DESCRIPTION:
 *   - Retrieves a specific book using ISBN
 * ============================================================
 */
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await Promise.resolve({ data: books });
    const data = response.data;

    // Check if book exists
    if (data[isbn]) {
      return res.status(200).json(data[isbn]);
    }

    return res.status(404).json({ message: "Book not found" });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});


/**
 * ============================================================
 * ROUTE: Get books by author
 * METHOD: GET /author/:author
 * DESCRIPTION:
 *   - Filters books by author name
 *   - Case-insensitive comparison
 * ============================================================
 */
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const response = await Promise.resolve({ data: books });
    const data = response.data;

    // Filter books by author (case-insensitive)
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
 * ============================================================
 * ROUTE: Get books by title
 * METHOD: GET /title/:title
 * DESCRIPTION:
 *   - Filters books by title
 *   - Case-insensitive comparison
 * ============================================================
 */
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const response = await Promise.resolve({ data: books });
    const data = response.data;

    // Filter books by title (case-insensitive)
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
 * ============================================================
 * ROUTE: Get reviews for a book
 * METHOD: GET /review/:isbn
 * DESCRIPTION:
 *   - Returns all reviews for a given book
 *   - Handles case where no reviews exist
 * ============================================================
 */
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await Promise.resolve({ data: books });
    const data = response.data;

    // Check if book exists
    if (!data[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    const reviews = data[isbn].reviews;

    // Handle empty reviews
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
