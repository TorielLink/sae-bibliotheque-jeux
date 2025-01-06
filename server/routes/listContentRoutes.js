const express = require('express');
const router = express.Router();
const controller = require('../controllers/listContentController');
const verifyToken = require('../middleware/auth');


/**
 * @swagger
 * /listContent/{id}:
 *   get:
 *     summary: Récupérer les contenus d’une liste spécifique
 *     description: >
 *       Cette route retourne les contenus pour une liste donnée, identifiée par son ID.
 *     tags:
 *       - List Content
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liste
 *     responses:
 *       200:
 *         description: Contenus récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contents fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/ListContent'
 *       404:
 *         description: Liste non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', verifyToken, controller.getContentsByListId);

module.exports = router;
