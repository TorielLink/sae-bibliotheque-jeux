const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');

// Récupérer toutes les relations d'amitié
router.get('/', friendsController.getAll);

module.exports = router;
