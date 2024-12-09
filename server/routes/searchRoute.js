const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Recherche des jeux avec auto-complétion
 *     description: >
 *       Cette route permet de rechercher des jeux avec une fonctionnalité d'auto-complétion.
 *       Les résultats incluent l'ID, le nom et une image de couverture (si disponible).
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Terme de recherche
 *     responses:
 *       200:
 *         description: Résultats de recherche récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID du jeu
 *                   name:
 *                     type: string
 *                     description: Nom du jeu
 *                   cover:
 *                     type: string
 *                     description: URL de l'image de couverture du jeu (si disponible)
 *       400:
 *         description: Requête invalide, le paramètre `query` est manquant
 *       500:
 *         description: Erreur serveur
 */
router.get('/', searchController.autoComplete);

module.exports = router;
