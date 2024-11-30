const express = require('express');
const router = express.Router();
const gameListController = require('../controllers/gameListsController');

// Récupérer toutes les listes de jeux
router.get('/', gameListController.getAll);

module.exports = router;
