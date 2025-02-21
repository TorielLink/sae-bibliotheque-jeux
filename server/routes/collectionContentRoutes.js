const express = require('express')
const router = express.Router()
const collectionContentController = require('../controllers/collectionContentController')
/**
 * @swagger
 * /collection-content/add-games/{gameCollectionId}:
 *   post:
 *     summary: Add games to a game collection
 *     description: Adds a list of games to a specific game collection.
 *     tags:
 *       - Collection Content
 *     parameters:
 *       - in: path
 *         name: gameCollectionId
 *         required: true
 *         description: The ID of the game collection to which games should be added.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gamesIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [101, 202, 303]
 *                 description: List of game IDs to be added to the collection.
 *     responses:
 *       200:
 *         description: Games successfully added to the collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Games successfully added to the collection.
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input data.
 *       404:
 *         description: Game collection not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game collection not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error adding games to the collection.
 *                 error:
 *                   type: string
 *                   example: Error details go here.
 */
router.post('/add-games/:gameCollectionId', collectionContentController.addGamesToCollection)

/**
 * @swagger
 * /collection-content/remove-games/{gameCollectionId}:
 *   delete:
 *     summary: Remove games from a specific game collection
 *     description: Removes a list of game IDs from a game collection.
 *     tags:
 *       - Collection Content
 *     parameters:
 *       - in: path
 *         name: gameCollectionId
 *         required: true
 *         description: The ID of the game collection to which games should be removed.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gamesIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [101, 202, 303]
 *                 description: List of game IDs to be removed from the collection.
 *     responses:
 *       200:
 *         description: Successfully removed games from the collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Games successfully removed from collection
 *       404:
 *         description: Game collection not found or no games to remove.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game collection not found or no games to remove
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error removing games from collection
 *                 error:
 *                   type: string
 *                   example: Error details go here.
 */
router.delete('/remove-games/:gameCollectionId', collectionContentController.removeGamesFromCollection)

/**
 * @swagger
 * /collection-content/update-collections/game/{gameId}:
 *   post:
 *     summary: Updates the collections for a game
 *     description: Adds and removes a game from several collections
 *     tags:
 *       - Collection Content
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         description: The ID of the game to be added/removes from the collections.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collectionsIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *                 description: List of all the collections the game should be in.
 *     responses:
 *       200:
 *         description: Game added to collections 1,2. Game removed from collections 4,5.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game successfully added to the collections.
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input data.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error adding the game to collections.
 *                 error:
 *                   type: string
 *                   example: Error details go here.
 */
router.post('/update-collections/game/:gameId', collectionContentController.updateCollectionsForGame)

module.exports = router