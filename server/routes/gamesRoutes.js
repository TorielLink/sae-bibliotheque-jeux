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
router.get('/:lang/:id', gamesController.getGameDetails);

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

/**
 * @swagger
 * /games/by-genres:
 *   post:
 *     summary: Récupérer les jeux par genres
 *     tags:
 *       - Games
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: integer
 *                 description: Nombre de jeux à retourner
 *               offset:
 *                 type: integer
 *                 description: Décalage des résultats
 *               genres:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Liste des IDs des genres
 *     responses:
 *       200:
 *         description: Jeux récupérés par genres avec succès
 *       400:
 *         description: Requête invalide (genres manquants ou incorrects)
 *       500:
 *         description: Erreur serveur
 */
router.post('/by-genres', gamesController.getGamesByGenres);

/**
 * @swagger
 * /games/specific:
 *   post:
 *     summary: Récupérer des jeux spécifiques
 *     tags:
 *       - Games
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *             example:
 *               gameIds: [1942, 77336]
 *     responses:
 *       200:
 *         description: Jeux spécifiques récupérés avec succès
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/specific', gamesController.getSpecificGames);

module.exports = router;
