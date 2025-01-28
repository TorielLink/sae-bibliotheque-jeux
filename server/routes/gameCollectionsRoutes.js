const express = require('express')
const router = express.Router()
const gameCollectionsController = require('../controllers/gameCollectionsController')

/**
 * @swagger
 * /game-collections/{userId}:
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
router.get('/:userId', gameCollectionsController.getByUser);

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
 *               description:
 *                 type: string
 *                 description: A short description of the new collection
 *     responses:
 *       201:
 *         description: Game collection created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/create/:userId', gameCollectionsController.createCollection);

module.exports = router;