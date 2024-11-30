const express = require('express');
const router = express.Router();
const listContentController = require('../controllers/listContentController');

// Récupérer tout le contenu des listes
router.get('/', listContentController.getAll);

module.exports = router;
