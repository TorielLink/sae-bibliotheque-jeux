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

module.exports = router;
