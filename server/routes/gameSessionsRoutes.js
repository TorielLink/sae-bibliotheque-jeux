const express = require('express');
const router = express.Router();
const gameSessionController = require('../controllers/gameSessionsController');

// Récupérer toutes les sessions de jeu
router.get('/', gameSessionController.getAll);

module.exports = router;
