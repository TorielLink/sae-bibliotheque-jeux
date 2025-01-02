const express = require('express');
const router = express.Router();
const gameSessionController = require('../controllers/gameSessionsController');

/**
 * @swagger
 * /gameSessions:
 *   get:
 *     summary: Récupérer toutes les sessions de jeu
 *     description: >
 *       Cette route retourne toutes les sessions de jeu disponibles dans la base de données.
 *     tags:
 *       - Game Sessions
 *     responses:
 *       200:
 *         description: Liste des sessions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game sessions fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameSession'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', gameSessionController.getAll);

/**
 * @swagger
 * /gameSessions/log/{logId}:
 *     summary: Récupérer toutes les sessions d'un journal
 *     description: >
 *       Cette route retourne toutes les sessions de jeu d'un journal en particulier
 *     tags:
 *       - Game Sessions
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID du journal
 *     responses:
 *       200:
 *         description: Liste des sessions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game sessions fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameSession'
 *       404:
 *         description: Aucun journal trouvé pour cet utilisateur
 *       500:
 *         description: Erreur serveur
 */

router.get('/log/:logId', gameSessionController.getAllByLog)

/**
 * @swagger
 * /update/{sessionId}:
 *   summary: Mettre à jour une session de jeu
 *   description: >
 *     Cette route permet de mettre à jour le titre, le contenu et le temps joué d'une session de jeu.
 *   tags:
 *     - Game Sessions
 *   parameters:
 *     - in: path
 *       name: sessionId
 *       required: true
 *       schema:
 *         type: integer
 *       description: L'ID de la session à mettre à jour
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: Le titre de la session de jeu
 *               example: "Avancement dans la quête principale"
 *             content:
 *               type: string
 *               description: Le contenu de la session de jeu
 *               example: "J'ai joué pendant deux heures, c'était génial!"
 *             time_played:
 *               type: integer
 *               description: Le temps joué en minutes
 *               example: 120
 *   responses:
 *     200:
 *       description: Session mise à jour avec succès
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Session updated successfully"
 *               data:
 *                 $ref: '#/components/schemas/GameSession'
 *     400:
 *       description: Demande invalide (par exemple, paramètres manquants ou incorrects)
 *     404:
 *       description: La session spécifiée n'a pas été trouvée
 *     500:
 *       description: Erreur serveur
 */

router.put('/update/:sessionId', gameSessionController.updateSession)


module.exports = router;

