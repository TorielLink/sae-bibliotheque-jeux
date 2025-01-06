const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameReviewsController');
const verifyToken = require('../middleware/auth');

/**
 * @swagger
 * /gameReviews:
 *   get:
 *     summary: Récupérer toutes les critiques
 *     description: >
 *       Cette route retourne toutes les critiques de jeux avec leurs paramètres de confidentialité,
 *       les informations de l'utilisateur (username, profile_picture), la note (si existante),
 *       et les détails du jeu (titre et couverture) via l'API IGDB.
 *     tags:
 *       - Game Reviews
 *     responses:
 *       200:
 *         description: Liste des critiques récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reviews fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       igdb_game_id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       spoiler:
 *                         type: boolean
 *                       date_published:
 *                         type: string
 *                         format: date-time
 *                       review_privacy:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           profile_picture:
 *                             type: string
 *                             format: uri
 *                       rating:
 *                         type: integer
 *                         description: Note de l'utilisateur pour ce jeu
 *                       game:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           cover:
 *                             type: string
 *                             format: uri
 *       500:
 *         description: Erreur serveur
 */
router.get('/', controller.getAllReviews);

/**
 * @swagger
 * /gameReviews/game/{id}:
 *   get:
 *     summary: Récupérer les critiques d'un jeu spécifique
 *     description: >
 *       Cette route retourne toutes les critiques pour un jeu donné (identifié par `igdb_game_id`),
 *       avec les informations de l'utilisateur (username, profile_picture), la note (si existante),
 *       les paramètres de confidentialité, et les détails du jeu (titre et couverture) via l'API IGDB.
 *     tags:
 *       - Game Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu (igdb_game_id)
 *     responses:
 *       200:
 *         description: Critiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game reviews fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       igdb_game_id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       spoiler:
 *                         type: boolean
 *                       date_published:
 *                         type: string
 *                         format: date-time
 *                       review_privacy:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           profile_picture:
 *                             type: string
 *                             format: uri
 *                       rating:
 *                         type: integer
 *                         description: Note de l'utilisateur pour ce jeu
 *                       game:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           cover:
 *                             type: string
 *                             format: uri
 *       404:
 *         description: Aucune critique trouvée pour ce jeu
 *       500:
 *         description: Erreur serveur
 */
router.get('/game/:id', controller.getReviewsByGameId);

/**
 * @swagger
 * /gameReviews/user_review:
 *   get:
 *     summary: Récupérer les critiques d'un utilisateur authentifié
 *     description: >
 *       Cette route retourne toutes les critiques faites par l'utilisateur actuellement authentifié,
 *       avec les paramètres de confidentialité, la note (si existante),
 *       et les détails du jeu (titre, couverture) via l'API IGDB.
 *     tags:
 *       - Game Reviews
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Critiques de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User reviews fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       igdb_game_id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       spoiler:
 *                         type: boolean
 *                       date_published:
 *                         type: string
 *                         format: date-time
 *                       review_privacy:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           profile_picture:
 *                             type: string
 *                             format: uri
 *                       rating:
 *                         type: integer
 *                         description: Note de l'utilisateur pour ce jeu
 *                       game:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           cover:
 *                             type: string
 *                             format: uri
 *       404:
 *         description: Aucune critique trouvée pour cet utilisateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/user_review', verifyToken, controller.getReviewsByUserId);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Ajouter une critique et une note pour un jeu
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID de l'utilisateur
 *               igdb_game_id:
 *                 type: integer
 *                 description: ID du jeu (IGDB)
 *               review_text:
 *                 type: string
 *                 description: Texte de la critique
 *               rating_value:
 *                 type: number
 *                 format: float
 *                 description: Note du jeu
 *               privacy_id:
 *                 type: integer
 *                 description: ID du paramètre de confidentialité
 *             required:
 *               - user_id
 *               - igdb_game_id
 *               - review_text
 *     responses:
 *       201:
 *         description: Critique ajoutée avec succès
 *       400:
 *         description: Données de requête manquantes ou invalides
 *       404:
 *         description: Utilisateur ou jeu non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', verifyToken, controller.addReview);

/**
 * @swagger
 * /gameReviews/{id}:
 *   put:
 *     summary: Mettre à jour une critique
 *     tags:
 *       - Game Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la critique à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Texte de la critique
 *               privacy_setting_id:
 *                 type: integer
 *                 description: ID du paramètre de confidentialité
 *               platform_id:
 *                 type: integer
 *                 description: ID de la plateforme
 *               spoiler:
 *                 type: boolean
 *                 description: Indique si la critique contient des spoilers
 *     responses:
 *       200:
 *         description: Critique mise à jour avec succès
 *       400:
 *         description: Données de requête manquantes ou invalides
 *       403:
 *         description: Non autorisé à modifier cette critique
 *       404:
 *         description: Critique non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', verifyToken, controller.updateReview);

/**
 * @swagger
 * /gameReviews/{id}:
 *   delete:
 *     summary: Supprimer une critique
 *     tags:
 *       - Game Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la critique à supprimer
 *     responses:
 *       200:
 *         description: Critique supprimée avec succès
 *       403:
 *         description: Non autorisé à supprimer cette critique
 *       404:
 *         description: Critique non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', verifyToken, controller.deleteReview);

module.exports = router;
