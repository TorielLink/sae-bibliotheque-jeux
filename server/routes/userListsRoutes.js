const express = require('express');
const router = express.Router();
const userListsController = require('../controllers/userListsController');

// Récupérer toutes les relations entre utilisateurs et listes
router.get('/', userListsController.getAll);

module.exports = router;
