const express = require('express');
const router = express.Router();
const gameLogsController = require('../controllers/gameLogsController');

// Récupérer tous les journaux de jeux
router.get('/', gameLogsController.getAll);

module.exports = router;
