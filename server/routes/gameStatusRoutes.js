const express = require('express');
const router = express.Router();
const gameStatusController = require('../controllers/gameStatusController');

// Récupérer tous les statuts de jeu
router.get('/', gameStatusController.getAllGameStatuses);

// Récupérer les statuts de jeu pour un utilisateur spécifique
router.get('/user/:userId', gameStatusController.getGameStatusesByUser);

// Récupérer les statuts de jeu pour un jeu spécifique
router.get('/game/:igdb_game_id', gameStatusController.getGameStatusesByGame);

module.exports = router;
