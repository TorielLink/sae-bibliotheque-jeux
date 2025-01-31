const express = require('express')
const router = express.Router()
const gameCollectionsController = require('../controllers/gameCollectionsController')

/**
 * @swagger
 * /game-collections/collection/{gameCollectionId}:
 *   get:
 *     summary: Get details of a specific game collection
 *     description: Fetches the details of a specific game collection by its ID, including its content (games).
 *     tags:
 *       - Game Collections
 *     parameters:
 *       - in: path
 *         name: gameCollectionId
 *         required: true
 *         description: The ID of the game collection to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved game collection data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game collections fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     game_collection_id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: My Collection
 *                     description:
 *                       type: string
 *                       example: A list of my favorite games
 *                     collection_content:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           igdb_game_id:
 *                             type: integer
 *                             example: 101
 *       404:
 *         description: Game collection not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game collection not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching game collections for user
 *                 error:
 *                   type: string
 *                   example: Error details go here.
 */
router.get('/collection/:gameCollectionId', gameCollectionsController.getById)

/**
 * @swagger
 * /game-collections/user/{userId}:
 *   get:
 *     summary: Get game collections by user ID
 *     description: This route fetches the game collections for a specific user identified by their ID.
 *     tags:
 *       - Game Collections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user for whom to fetch the game collections.
 *     responses:
 *       200:
 *         description: Successfully retrieved game collections for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Game collections fetched successfully'
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       game_collection_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       collection_content:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             igdb_game_id:
 *                               type: integer
 *       500:
 *         description: Error fetching game collections for user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get('/user/:userId', gameCollectionsController.getByUser)

/**
 * @swagger
 * /game-collections/create/{userId}:
 *   post:
 *     summary: Create a new game collection
 *     description: This route creates a new game collection for a specific user with the provided name and description.
 *     tags:
 *       - Game Collections
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user for whom the game collection will be created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new collection
 *                 example: "Mes jeux 2024"
 *               description:
 *                 type: string
 *                 description: A short description of the new collection
 *                 example: "Mes jeux préférés de 2024"
 *               privacy:
 *                 type: integer
 *                 description: ID of the collection's privacy setting
 *                 example: 1
 *     responses:
 *       201:
 *         description: Game collection created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/create/:userId', gameCollectionsController.createCollection)

/**
 * @swagger
 * /game-collections/update/{gameCollectionId}:
 *   post:
 *     summary: Update a game collection
 *     description: Updates the name, description, privacy settings, and game list of a specific game collection.
 *     tags:
 *       - Game Collections
 *     parameters:
 *       - in: path
 *         name: gameCollectionId
 *         required: true
 *         description: ID of the game collection to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the game collection.
 *                 example: "My Updated Collection"
 *               description:
 *                 type: string
 *                 description: The new description of the game collection.
 *                 example: "An updated description for my collection."
 *               privacy:
 *                 type: integer
 *                 description: Privacy setting for the game collection (e.g., public, private).
 *                 example: 1
 *               newGames:
 *                 type: array
 *                 description: Updated list of game IDs to include in the collection.
 *                 items:
 *                   type: integer
 *                 example: [101, 202, 303]
 *     responses:
 *       200:
 *         description: Game collection updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game collection updated successfully.
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
 *         description: Error updating game collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating game collection.
 *                 error:
 *                   type: string
 *                   example: Internal server error.
 */
router.post('/update/:gameCollectionId', gameCollectionsController.updateCollection)

/**
 * @swagger
 * /game-collections/delete/{gameCollectionId}:
 *   delete:
 *     summary: Delete a game collection
 *     description: Deletes a game collection by its ID.
 *     tags:
 *       - Game Collections
 *     parameters:
 *       - in: path
 *         name: gameCollectionId
 *         required: true
 *         description: The ID of the game collection to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Game collection deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game collection deleted successfully.
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
 *                   example: Error deleting game collection.
 *                 error:
 *                   type: string
 *                   example: Error details go here.
 */
router.delete('/delete/:gameCollectionId', gameCollectionsController.deleteCollection)

module.exports = router