const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');

// Récupérer tous les amis d’un utilisateur spécifique
router.get('/:id', friendsController.getFriendsByUserId);
/**
 * @swagger
 * /games:
 *   get:
 *     summary: Récupère tous les jeux
 *     responses:
 *       200:
 *         description: Liste des jeux
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                      name:
 *                     type: string
 *example: "The Legend of Zelda"
 */
// Récupérer toutes les relations d’amitié
router.get('/', friendsController.getAllFriends);

module.exports = router;
