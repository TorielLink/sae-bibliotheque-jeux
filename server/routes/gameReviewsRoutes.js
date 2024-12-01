const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameReviewsController');

// Récupérer toutes les critiques
router.get('/', controller.getAllReviews);

// Récupérer les critiques d'un jeu spécifique
router.get('/game/:id', controller.getReviewsByGameId);

// Récupérer les critiques d'un utilisateur spécifique
router.get('/user/:id', controller.getReviewsByUserId);

module.exports = router;
