const express = require('express');
const router = express.Router();
const gamePlatformsController = require('../controllers/gamePlatformsController');

// Récupérer toutes les plateformes
router.get('/', gamePlatformsController.getAll);

module.exports = router;
