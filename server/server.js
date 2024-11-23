// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const gameRoutes = require('./routes/gamesRoute');        // Your game routes
const gameGenreRoutes = require('./routes/gameGenreRoute');  // Your game genre routes

const app = express();

// Middleware for CORS
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5175'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/games', gameRoutes);           // Route for games
app.use('/gameGenres', gameGenreRoutes); // Route for game genres

// Error Handling for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Internal server error.', error: err.message });
});

// Start the Server
const PORT = process.env.PORT_APP || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
