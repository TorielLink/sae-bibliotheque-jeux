const express = require('express');
const router = express.Router();
const gameListController = require('../controllers/gameListsController');

/**
 * @swagger
 * /gameLists:
 *   get:
 *     summary: Récupérer toutes les listes de jeux
 *     description: >
 *       Cette route retourne toutes les listes de jeux disponibles dans la base de données.
 *     tags:
 *       - Game Lists
 *     responses:
 *       200:
 *         description: Liste des jeux récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game lists fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameList'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', gameListController.getAll);

module.exports = router;
