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
 *                     $ref: '#/components/schemas/LogPlatform'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', gameStatusController.getAllGameStatus);
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
*                     $ref: '#/components/schemas/LogPlatform'
*       404:
*         description: Aucun statut trouvé pour cet utilisateur
*       500:
*         description: Erreur serveur
*/
router.get('/user/:userId', gameStatusController.getGameStatusByUser);
/**
 * @swagger
 * /gameStatus/user/{userId}/game/{gameId}:
 *   get:
 *     summary: Récupérer le statut de jeu pour un utilisateur spécifique et un jeu donné
 *     description: >
 *       Cette route retourne le statut de jeu pour un utilisateur donné et un jeu spécifique.
 *     tags:
 *       - Game Status
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu
 *     responses:
 *       200:
 *         description: Statut récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game status fetched successfully
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/LogPlatform'
 *       404:
 *         description: Aucun statut trouvé pour cet utilisateur et ce jeu
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId/game/:gameId', gameStatusController.getStatusByUserAndGame);

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
 *                     $ref: '#/components/schemas/LogPlatform'
 *       404:
 *         description: Aucun statut trouvé pour ce jeu
 *       500:
 *         description: Erreur serveur
 */
router.get('/game/:igdb_game_id', gameStatusController.getGameByGame);

/**
 * @swagger
 * /gameStatus/update/{userId}/{gameId}:
 *   put:
 *     summary: Mettre à jour un statut de jeu spécifique
 *     description: >
 *       Cette route permet de mettre à jour un statut de jeu avec un nouvel ID de statut fourni.
 *     tags:
 *       - Game Status
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du jeu
 *     requestBody:
 *       description: Les données à mettre à jour pour le statut de jeu
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               game_status_id:
 *                 type: integer
 *             example:
 *               game_status_id: 2
 *     responses:
 *       200:
 *         description: Statut de jeu mis à jour avec succès
 *       404:
 *         description: Statut de jeu introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put('/update/:userId/:gameId', gameStatusController.updateGameStatus);

module.exports = router