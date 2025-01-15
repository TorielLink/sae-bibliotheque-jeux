const express = require('express');
const router = express.Router();
const gameLogsController = require('../controllers/gameLogsController');

/**
 * @swagger
 * /gameLogs:
 *   get:
 *     summary: Récupérer tous les journaux de jeu
 *     description: >
 *       Cette route retourne tous les journaux de jeu avec leurs relations, y compris :
 *       - L'utilisateur ayant créé le journal (relation Many-to-One avec `users`)
 *       - La plateforme associée (relation Many-to-One avec `game_platforms`)
 *       - Le paramètre de confidentialité associé (relation Many-to-One avec `privacy_settings`)
 *     tags:
 *       - Game Logs
 *     responses:
 *       200:
 *         description: Liste des journaux de jeu récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game logs fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameLog'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', gameLogsController.getAll);

/**
 * @swagger
 * /gameLogs/user/{userId}:
 *   get:
 *     summary: Récupérer les journaux de jeu d'un utilisateur spécifique
 *     description: >
 *       Cette route retourne tous les journaux de jeu créés par un utilisateur spécifique, avec leurs relations, y compris :
 *       - La plateforme associée
 *       - Le paramètre de confidentialité
 *     tags:
 *       - Game Logs
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des journaux de jeu récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game logs fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameLog'
 *       404:
 *         description: Aucun journal trouvé pour cet utilisateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId', gameLogsController.getByUserId);

/**
 * @swagger
 * /gameLogs/user/{userId}/game/{gameId}:
 *   get:
 *     summary: Récupérer les journaux de jeu d'un utilisateur et d'un jeu spécifique
 *     description: >
 *       Cette route retourne tous les journaux de jeu créés par un utilisateur pour un jeu en particulier, avec leurs relations, y compris :
 *       - La plateforme associée
 *       - Le paramètre de confidentialité
 *     tags:
 *       - Game Logs
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'utilisateur
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des journaux de jeu récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game logs fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameLog'
 *       404:
 *         description: Aucun journal trouvé pour cet utilisateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId/game/:gameId', gameLogsController.getByUserAndGame);

/**
 * @swagger
 * /gameLogs/update/{logId}:
 *   put:
 *     summary: Mettre à jour un journal de jeu spécifique
 *     description: >
 *       Cette route met à jour un journal de jeu spécifique avec les données fournies.
 *     tags:
 *       - Game Logs
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID du journal de jeu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privacy_setting_id:
 *                 type: integer
 *               platform_id:
 *                 type: integer
 *               time_played:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Journal de jeu mis à jour avec succès
 *       404:
 *         description: Journal de jeu introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put('/update/:logId', gameLogsController.updateLog)

/**
 * @swagger
 * /gameLogs/delete/{logId}:
 *   delete:
 *     summary: Supprimer un journal de jeu spécifique
 *     description: >
 *       Cette route permet de supprimer un journal de jeu avec l'ID spécifié.
 *     tags:
 *       - Game Logs
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du journal de jeu à supprimer
 *     responses:
 *       200:
 *         description: Journal de jeu supprimé avec succès
 *       404:
 *         description: Journal de jeu introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete/:logId', gameLogsController.deleteLog)

/**
 * @swagger
 * /gameLogs/create/user/{userId}/game/{gameId}:
 *   post:
 *     summary: Créer un nouveau journal de jeu
 *     description: >
 *       Cette route permet de créer un nouveau journal de jeu avec les IDs utilisateur et jeu spécifiés en tant que paramètres.
 *     tags:
 *       - Game Logs
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
 *       201:
 *         description: Journal de jeu créé avec succès
 *       400:
 *         description: Données manquantes ou invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/create/user/:userId/game/:gameId', gameLogsController.createLog);


module.exports = router;