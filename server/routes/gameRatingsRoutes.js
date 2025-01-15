const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameRatingsController');

/**
 * @swagger
 * /gameRatings:
 *   get:
 *     summary: Récupérer toutes les évaluations
 *     description: >
 *       Cette route retourne toutes les évaluations de jeux, y compris leurs paramètres de confidentialité.
 *     tags:
 *       - Game Ratings
 *     responses:
 *       200:
 *         description: Liste des évaluations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ratings fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameRating'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', controller.getAllRatings);

/**
 * @swagger
 * /gameRatings/game/{id}:
 *   get:
 *     summary: Récupérer les évaluations d'un jeu spécifique
 *     description: >
 *       Cette route retourne toutes les évaluations pour un jeu donné, identifiées par `igdb_game_id`.
 *     tags:
 *       - Game Ratings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu (igdb_game_id)
 *     responses:
 *       200:
 *         description: Évaluations récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game ratings fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameRating'
 *       404:
 *         description: Aucune évaluation trouvée pour ce jeu
 *       500:
 *         description: Erreur serveur
 */
router.get('/game/:id', controller.getRatingsByGameId);

/**
 * @swagger
 * /gameRatings/user/{id}:
 *   get:
 *     summary: Récupérer les évaluations d'un utilisateur spécifique
 *     description: >
 *       Cette route retourne toutes les évaluations faites par un utilisateur donné.
 *     tags:
 *       - Game Ratings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Évaluations de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ratings fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameRating'
 *       404:
 *         description: Aucune évaluation trouvée pour cet utilisateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:id', controller.getRatingsByUserId);

/**
 * @swagger
 * /gameRatings/game/{id}/average:
 *   get:
 *     summary: Récupérer la moyenne des évaluations pour un jeu
 *     description: >
 *       Cette route calcule et retourne la moyenne de toutes les évaluations d'un jeu donné.
 *     tags:
 *       - Game Ratings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu (igdb_game_id)
 *     responses:
 *       200:
 *         description: Moyenne récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Average rating fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     average:
 *                       type: number
 *                       format: float
 *       404:
 *         description: Aucune évaluation trouvée pour ce jeu
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/average', controller.getAverageRatingByGameId);

module.exports = router;
