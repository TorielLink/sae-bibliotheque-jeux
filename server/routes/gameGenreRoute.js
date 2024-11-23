// gameGenreRoute.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameGenreController');  // Correct path to your controller

// Define the route to fetch all game genres
router.get('/', controller.getAll);  // Make sure you're calling the controller function correctly

module.exports = router;
