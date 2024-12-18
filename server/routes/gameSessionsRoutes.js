const express = require('express');
const router = express.Router();
const gameSessionController = require('../controllers/gameSessionsController');

/**
 * @swagger
 * /gameSessions:
 *   get:
 *     summary: Récupérer toutes les sessions de jeu
 *     description: >
 *       Cette route retourne toutes les sessions de jeu disponibles dans la base de données.
 *     tags:
 *       - Game Sessions
 *     responses:
 *       200:
 *         description: Liste des sessions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game sessions fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameSession'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', gameSessionController.getAll);

/**
 * @swagger
 * /gameSessions/log/{logId}:
 *   summary: Récupérer toutes les sessions d'un journal
 *     description: >
 *       Cette route retourne toutes les sessions de jeu d'un journal en particulier
 *     tags:
 *       - Game Sessions
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID du journal
 *     responses:
 *       200:
 *         description: Liste des sessions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game sessions fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameSession'
 *       404:
 *         description: Aucun journal trouvé pour cet utilisateur
 *       500:
 *         description: Erreur serveur
 */

router.get('/log/:logId', gameSessionController.getAllByLog);

module.exports = router;

