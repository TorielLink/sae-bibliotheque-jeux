const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameRatingsController');

// Récupérer toutes les évaluations
router.get('/', controller.getAllRatings);

// Récupérer les évaluations d'un jeu spécifique
router.get('/game/:id', controller.getRatingsByGameId);

// Récupérer les évaluations d'un utilisateur spécifique
router.get('/user/:id', controller.getRatingsByUserId);

module.exports = router;
