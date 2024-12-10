const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');

/**
 * @swagger
 * /games/by-date:
 *   get:
 *     summary: Récupérer les jeux récents
 *     description: Cette route retourne les jeux récents triés par date de sortie.
 *     tags:
 *       - Games
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de jeux à retourner
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Décalage des résultats
 *     responses:
 *       200:
 *         description: Jeux récents récupérés avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/by-date', gamesController.getFilteredGames);

/**
 * @swagger
 * /games/by-popularity:
 *   get:
 *     summary: Récupérer les jeux populaires
 *     tags:
 *       - Games
 *     responses:
 *       200:
 *         description: Jeux populaires récupérés avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/by-popularity', gamesController.getPopularGames);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Récupérer les détails d’un jeu spécifique
 *     tags:
 *       - Games
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu
 *     responses:
 *       200:
 *         description: Détails du jeu récupérés avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', gamesController.getGameDetails);

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Récupérer une liste de jeux avec filtres
 *     tags:
 *       - Games
 *     responses:
 *       200:
 *         description: Jeux récupérés avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', gamesController.getFilteredGames);

module.exports = router;
