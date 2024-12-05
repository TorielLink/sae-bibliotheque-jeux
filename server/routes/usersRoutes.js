const express = require('express');
const router = express.Router();
const { uploadProfilePicture } = require('../middleware/upload'); // Middleware pour l'upload
const { users } = require('../controllers/indexController');
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: >
 *       Cette route retourne tous les utilisateurs enregistrés.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur
 */

router.get('/', users.getAll);
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     description: >
 *       Cette route permet de créer un nouvel utilisateur.
 *       Elle accepte également une image de profil en tant que fichier.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               mail:
 *                 type: string
 *                 description: Adresse e-mail
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image pour le profil
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/', uploadProfilePicture, users.create);

module.exports = router;
