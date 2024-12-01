const express = require('express');
const router = express.Router();
const controller = require('../controllers/listContentController'); // Chemin correct vers le contrôleur

// Récupérer tous les contenus de listes
router.get('/', controller.getAllContents);

// Récupérer les contenus d’une liste spécifique par ID
router.get('/:id', controller.getContentsByListId);

module.exports = router;
