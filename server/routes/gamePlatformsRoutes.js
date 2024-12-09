const express = require('express');
const router = express.Router();
const gamePlatformsController = require('../controllers/gamePlatformsController');

/**
 * @swagger
 * /gamePlatforms:
 *   get:
 *     summary: Récupérer toutes les plateformes de jeu
 *     description: >
 *       Cette route retourne toutes les plateformes de jeu disponibles dans la base de données.
 *     tags:
 *       - Game Platforms
 *     responses:
 *       200:
 *         description: Liste des plateformes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game platforms fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GamePlatform'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', gamePlatformsController.getAll);

module.exports = router;
