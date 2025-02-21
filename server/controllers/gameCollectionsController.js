const {gameCollection, collectionContent} = require('../database/sequelize');

const controller = {}

const fetchGamesInfo = async (gameIds) => {
    const response = await fetch('http://localhost:8080/games/specific', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gameIds: gameIds,
        }),
    })

    return await response.json()
}

controller.getById = async (req, res) => {
    try {
        const {gameCollectionId} = req.params

        const response = await gameCollection.findByPk(gameCollectionId, {
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
        }).then((result) => result.get({plain: true}))

        const gameIds = []
        response.collection_content.forEach((content) => {
            gameIds.push(content.igdb_game_id)
        })

        const gamesData = await fetchGamesInfo(gameIds)

        response.collection_content = response.collection_content.map((content) => {
            return gamesData.find((game) => game.id === content.igdb_game_id) || {}
        })

        res.status(200).json({message: 'Game collections fetched successfully', data: response})
    } catch (error) {
        console.error('Error fetching game collections for user:', error)
        res.status(500).json({message: 'Error fetching game collections for user', error: error.message})
    }
}

controller.getByUser = async (req, res) => {
    try {
        const {userId} = req.params

        const collections = await gameCollection.findAll({
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

        const gamesData = await fetchGamesInfo(gameIds)

        const enrichedCollections = collections.map((collection) => {
            const enrichedContent = collection.collection_content.map((content) => {
                return gamesData.find((game) => game.id === content.igdb_game_id) || {}
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
        const {name, description, privacy} = req.body

        const newCollection = await gameCollection.create({
            name: name,
            description: description,
            privacy_setting_id: privacy,
            user_id: userId
        })

        res.status(201).json({message: 'Game collection created successfully', data: newCollection})
    } catch (error) {
        console.error('Error creating game collection:', error)
        res.status(500).json({message: 'Error creating game collection', error: error.message})
    }
}

controller.updateCollection = async (req, res) => {
    try {
        const {gameCollectionId} = req.params
        const {name, description, privacy, newGames} = req.body

        const collection = await gameCollection.findByPk(gameCollectionId, {
            include: {
                model: collectionContent,
                as: 'collection_content',
                attributes: ['igdb_game_id']
            }
        })

        if (!collection) {
            return res.status(404).json({message: 'Game collection not found'})
        }

        await collection.update({name, description, privacy_setting_id: privacy})

        const addGamesResponse = await fetch(`http://localhost:8080/collection-content/add-games/${gameCollectionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gamesIds: newGames,
            }),
        })

        const removeGamesResponse = await fetch(`http://localhost:8080/collection-content/remove-games/${gameCollectionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gamesIds: newGames,
            }),
        })
        const addGamesMessage = (await addGamesResponse.json()).message
        const removeGamesMessage = (await removeGamesResponse.json()).message

        res.status(200).json({message: `${addGamesMessage} ${removeGamesMessage}`, data: collection})
    } catch (error) {
        console.error('Error updating game collection:', error)
        res.status(500).json({message: 'Error updating game collection', error: error.message})
    }
}

controller.deleteCollection = async (req, res) => {
    try {
        const {gameCollectionId} = req.params

        const collection = await gameCollection.findByPk(gameCollectionId, {
            include: {
                model: collectionContent,
                as: 'collection_content',
                attributes: ['igdb_game_id']
            }
        })

        if (!collection) {
            return res.status(404).json({message: 'Game collection not found'})
        }

        const gameIds = collection.collection_content.map((game) => game.igdb_game_id)

        const removeGamesResponse = await fetch(`http://localhost:8080/collection-content/remove-games/${gameCollectionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gamesIds: gameIds,
            }),
        })

        await collection.destroy()
        res.status(200).json({message: 'Game collection deleted successfully', data: collection})
    } catch (error) {
        console.error('Error deleting game collection:', error)
        res.status(500).json({message: 'Error deleting game collection', error: error.message})
    }
}

module.exports = controller;
