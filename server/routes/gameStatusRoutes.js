const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameStatusController');

// Récupérer tous les statuts de jeu
router.get('/', controller.getAllStatuses);

// Récupérer tous les statuts de jeu pour un utilisateur spécifique
router.get('/user/:id', controller.getStatusesByUserId);

module.exports = router;
