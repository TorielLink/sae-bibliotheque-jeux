const express = require('express');
const router = express.Router();
const controller = require('../controllers/userListsController');
/**
 * @swagger
 * /userLists:
 *   get:
 *     summary: Récupérer toutes les associations entre utilisateurs et listes de jeux
 *     description: >
 *       Cette route retourne toutes les associations entre les utilisateurs et leurs listes de jeux.
 *     tags:
 *       - User Lists
 *     responses:
 *       200:
 *         description: Associations récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserList'
 *       500:
 *         description: Erreur serveur
 */
router.get('/',controller.getAllAssociations);
/**
 * @swagger
 * /userLists/users/{id}/lists:
 *   get:
 *     summary: Récupérer toutes les listes associées à un utilisateur
 *     description: >
 *       Cette route retourne toutes les listes de jeux associées à un utilisateur donné.
 *     tags:
 *       - User Lists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Listes récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameList'
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/users/:id/lists', controller.getUserLists);
/**
 * @swagger
 * /userLists/lists/{id}/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs associés à une liste
 *     description: >
 *       Cette route retourne tous les utilisateurs associés à une liste donnée.
 *     tags:
 *       - User Lists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la liste de jeux
 *     responses:
 *       200:
 *         description: Utilisateurs récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Liste non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/lists/:id/users', controller.getListUsers);

module.exports = router;
