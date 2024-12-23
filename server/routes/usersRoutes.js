const express = require('express');
const router = express.Router();
const { uploadProfilePicture } = require('../middleware/upload'); // Middleware pour l'upload
const controller = require('../controllers/usersController');
const verifyToken = require('../middleware/auth'); // Assurez-vous que c'est le bon chemin

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
router.get('/', controller.getAll);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentification utilisateur
 *     description: >
 *       Cette route permet à un utilisateur de se connecter en utilisant son nom d'utilisateur et son mot de passe.
 *       Un token JWT est retourné si les identifiants sont corrects.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', controller.login);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     description: >
 *       Cette route retourne un utilisateur spécifique à partir de son ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à récupérer
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', controller.getById);

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
router.post('/', uploadProfilePicture, controller.create);
/**
 * @swagger
 * /users/{id}/game-details:
 *   get:
 *     summary: Récupérer les statuts et journaux de jeux d'un utilisateur
 *     description: >
 *       Cette route retourne les statuts et journaux de jeux associés à un utilisateur spécifique.
 *     tags:
 *       - Users
 *       - Game Details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Statuts et journaux récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Détails des statuts et journaux de jeu récupérés avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "exemple_user"
 *                     user_status:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           game_status_id:
 *                             type: integer
 *                             example: 1
 *                           status:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "Playing"
 *                     user:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           time_played:
 *                             type: integer
 *                             example: 120
 *                           igdb_game_id:
 *                             type: integer
 *                             example: 101
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/game-details', controller.getUserGameDetails);

router.put('/:id', verifyToken, uploadProfilePicture, controller.update);
router.delete('/:id', verifyToken, controller.delete);

module.exports = router;
