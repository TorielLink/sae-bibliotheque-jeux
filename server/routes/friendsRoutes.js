const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');

/**
 * @swagger
 * /friends/{id}:
 *   get:
 *     summary: Récupérer tous les amis d’un utilisateur spécifique
 *     description: >
 *       Cette route retourne tous les amis d’un utilisateur en utilisant la relation Many-to-Many définie dans la table `friends`.
 *       L’utilisateur peut être associé à plusieurs amis via deux alias de relation :
 *       - `friendOf` : L'utilisateur est dans la colonne `user_id` de la table `friends`.
 *       - `friendsWith` : L'utilisateur est dans la colonne `user_id_1` de la table `friends`.
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des amis de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friends fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       description: ID de l'utilisateur
 *                     username:
 *                       type: string
 *                       description: Nom d'utilisateur
 *                     mail:
 *                       type: string
 *                       description: Adresse e-mail
 *                     friends:
 *                       type: array
 *                       description: Liste des amis de l'utilisateur
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                             description: ID de l'ami
 *                           username:
 *                             type: string
 *                             description: Nom d'utilisateur de l'ami
 *                           mail:
 *                             type: string
 *                             description: Adresse e-mail de l'ami
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.get('/:id', friendsController.getFriendsByUserId);
/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Récupérer toutes les relations d'amitié
 *     description: >
 *       Cette route retourne toutes les relations d'amitié stockées dans la table `friends`.
 *       Chaque relation d'amitié est définie par deux utilisateurs (relation Many-to-Many via `friends`).
 *     tags:
 *       - Friends
 *     responses:
 *       200:
 *         description: Liste de toutes les relations d'amitié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friends data fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         description: ID de l'utilisateur
 *                       user_id_1:
 *                         type: integer
 *                         description: ID de l'ami
 *       500:
 *         description: Erreur serveur
 */

router.get('/', friendsController.getAllFriends);

module.exports = router;
