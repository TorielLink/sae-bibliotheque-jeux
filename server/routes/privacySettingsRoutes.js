const express = require('express');
const router = express.Router();
const privacySettingsController = require('../controllers/privacySettingsController');

/**
 * @swagger
 * /currentPrivacySetting:
 *   get:
 *     summary: Récupérer toutes les options de confidentialité
 *     description: >
 *       Cette route retourne toutes les options de confidentialité disponibles dans la base de données.
 *     tags:
 *       - Privacy Settings
 *     responses:
 *       200:
 *         description: Liste des options de confidentialité récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Privacy settings fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/currentPrivacySetting'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', privacySettingsController.getAll);

module.exports = router;
