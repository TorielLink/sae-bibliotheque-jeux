const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

// Récupérer tous les statuts
router.get('/', statusController.getAll);

module.exports = router;
