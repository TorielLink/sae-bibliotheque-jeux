const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');

// Récupérer tous les amis d’un utilisateur spécifique
router.get('/:id', friendsController.getFriendsByUserId);

// Récupérer toutes les relations d’amitié
router.get('/', friendsController.getAllFriends);

module.exports = router;
