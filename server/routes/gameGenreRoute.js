// gameGenreRoute.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController');  // Correct path to your controller

// a modifier
router.get('/', controller.gameGenre.getAll);  // Make sure you're calling the controller function correctly

module.exports = router;
