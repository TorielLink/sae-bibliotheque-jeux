const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameReviewsController');
/**
 * @swagger
 * /gameReviews:
 *   get:
 *     summary: Récupérer toutes les critiques
 *     description: >
 *       Cette route retourne toutes les critiques de jeux avec leurs paramètres de confidentialité.
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
 *                     $ref: '#/components/schemas/GameReview'
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
 *       Cette route retourne toutes les critiques pour un jeu donné, identifiées par `igdb_game_id`.
 *     tags:
 *       - Game Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu
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
 *                     $ref: '#/components/schemas/GameReview'
 *       404:
 *         description: Aucune critique trouvée pour ce jeu
 *       500:
 *         description: Erreur serveur
 */
router.get('/game/:id', controller.getReviewsByGameId);

/**
 * @swagger
 * /gameReviews/user/{id}:
 *   get:
 *     summary: Récupérer les critiques d'un utilisateur spécifique
 *     description: >
 *       Cette route retourne toutes les critiques faites par un utilisateur donné.
 *     tags:
 *       - Game Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
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
 *                     $ref: '#/components/schemas/GameReview'
 *       404:
 *         description: Aucune critique trouvée pour cet utilisateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:id', controller.getReviewsByUserId);

module.exports = router;
