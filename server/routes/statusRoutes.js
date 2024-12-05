const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');
/**
 * @swagger
 * /status:
 *   get:
 *     summary: Récupérer tous les statuts de jeu
 *     description: >
 *       Cette route retourne tous les statuts de jeu disponibles (en cours, terminé, etc.).
 *     tags:
 *       - Status
 *     responses:
 *       200:
 *         description: Liste des statuts récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Status'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', statusController.getAll);

module.exports = router;
