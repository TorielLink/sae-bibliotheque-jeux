const express = require('express');
const router = express.Router();
const gameReviewController = require('../controllers/gameReviewsController');

// Récupérer toutes les critiques de jeux
router.get('/', gameReviewController.getAll);

module.exports = router;
