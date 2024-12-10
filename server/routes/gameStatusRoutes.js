const express = require('express');
const router = express.Router();
const gameStatusController = require('../controllers/gameStatusController');
/**
 * @swagger
 * /gameStatus:
 *   get:
 *     summary: Récupérer tous les statuts de jeu
 *     description: >
 *       Cette route retourne tous les statuts de jeu disponibles.
 *     tags:
 *       - Game Status
 *     responses:
 *       200:
 *         description: Liste des statuts récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game statuses fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameStatus'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', gameStatusController.getAllGameStatuses);
/**
 * @swagger
 * /gameStatus/user/{userId}:
 *   get:
 *     summary: Récupérer les statuts de jeu pour un utilisateur spécifique
 *     description: >
 *       Cette route retourne les statuts de jeu pour un utilisateur donné.
 *     tags:
 *       - Game Status
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Statuts récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game statuses fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameStatus'
 *       404:
 *         description: Aucun statut trouvé pour cet utilisateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId', gameStatusController.getGameStatusesByUser);
/**
 * @swagger
 * /gameStatus/game/{igdb_game_id}:
 *   get:
 *     summary: Récupérer les statuts de jeu pour un jeu spécifique
 *     description: >
 *       Cette route retourne tous les statuts de jeu associés à un jeu donné, identifié par `igdb_game_id`.
 *     tags:
 *       - Game Status
 *     parameters:
 *       - in: path
 *         name: igdb_game_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu (base IGDB)
 *     responses:
 *       200:
 *         description: Statuts de jeu récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game statuses fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameStatus'
 *       404:
 *         description: Aucun statut trouvé pour ce jeu
 *       500:
 *         description: Erreur serveur
 */
router.get('/game/:igdb_game_id', gameStatusController.getGameStatusesByGame);

module.exports = router;
