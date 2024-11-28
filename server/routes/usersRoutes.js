const express = require('express');
const router = express.Router();
const { uploadProfilePicture } = require('../middleware/upload'); // Middleware pour l'upload
const { users } = require('../controllers/indexController');

// Route pour récupérer tous les utilisateurs
router.get('/', users.getAll);

// Route pour créer un utilisateur avec middleware pour le fichier
router.post('/', uploadProfilePicture, users.create);

module.exports = router;
