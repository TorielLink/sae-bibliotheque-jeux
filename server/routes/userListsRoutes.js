const express = require('express');
const router = express.Router();
const controller = require('../controllers/userListsController');

// Récupérer tous les listes
router.get('/',controller.getAllAssociations);

// Récupérer toutes les listes associées à un utilisateur
router.get('/users/:id/lists', controller.getUserLists);

// Récupérer tous les utilisateurs associés à une liste
router.get('/lists/:id/users', controller.getListUsers);

module.exports = router;
