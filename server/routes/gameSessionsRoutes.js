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

module.exports = router;

