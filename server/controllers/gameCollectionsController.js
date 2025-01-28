const {gameCollections, collectionContent} = require('../database/sequelize');

const controller = {}

controller.getByUser = async (req, res) => {
    try {
        const {userId} = req.params

        const collections = await gameCollections.findAll({
            where: {user_id: userId},
            attributes: {
                exclude: ['user_id']
            },
            include: [
                {
                    model: collectionContent,
                    as: 'collection_content',
                    attributes: ['igdb_game_id']
                }
            ],
        }).then((results) => results.map((r) => r.get({plain: true})))

        const gameIds = []
        collections.forEach((collection) => {
            collection.collection_content.forEach((content) => {
                gameIds.push(content.igdb_game_id)
            })
        })

        const response = await fetch('http://localhost:8080/games/specific', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gameIds: gameIds,
            }),
        })

        const gamesData = await response.json()

        const enrichedCollections = collections.map((collection) => {
            const enrichedContent = collection.collection_content.map((content) => {
                const gameData = gamesData.find((game) => game.id === content.igdb_game_id) || {}
                return gameData
            })

            return {
                ...collection,
                collection_content: enrichedContent,
            }
        })

        res.status(200).json({message: 'Game collections fetched successfully', data: enrichedCollections})
    } catch (error) {
        console.error('Error fetching game collections for user:', error)
        res.status(500).json({message: 'Error fetching game collections for user', error: error.message})
    }
}

controller.createCollection = async (req, res) => {
    try {
        const {userId} = req.params
        const {name, description} = req.body

        const newCollection = await gameCollections.create({
            name: name,
            description: description,
            user_id: userId
        })

        res.status(201).json({message: 'Game collection created successfully', data: newCollection})
    } catch (error) {
        console.error('Error creating game collection:', error)
        res.status(500).json({message: 'Error creating game collection', error: error.message})
    }
}

module.exports = controller;
