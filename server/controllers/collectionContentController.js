const {gameCollection, collectionContent} = require("../database/sequelize");

const controller = {}

controller.addGamesToCollection = async (req, res) => {
    try {
        const {gameCollectionId} = req.params
        let {gamesIds} = req.body

        const collectionResponse = await fetch(`http://localhost:8080/game-collections/collection/${gameCollectionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const currentGames = ((await collectionResponse.json()).data.collection_content).map(game => game.igdb_game_id)
        gamesIds = gamesIds.filter(id => !currentGames.includes(id))

        if (gamesIds.length > 0) {
            const gamesToAdd = gamesIds.map(gameId => ({
                game_collection_id: gameCollectionId,
                igdb_game_id: gameId
            }))
            await collectionContent.bulkCreate(gamesToAdd)
        } else {
            res.status(200).json({message: 'There are no games to add.'})
            return
        }

        res.status(201).json({message: `Games added to the collection : ${gamesIds}.`})
    } catch (error) {
        console.error('Error adding games to the collection:', error)
        res.status(500).json({message: 'Error adding games to the collection', error: error.message})
    }
}

controller.removeGamesFromCollection = async (req, res) => {
    try {
        const {gameCollectionId} = req.params
        let {gamesIds} = req.body

        const collectionResponse = await fetch(`http://localhost:8080/game-collections/collection/${gameCollectionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const currentGames = ((await collectionResponse.json()).data.collection_content).map(game => game.igdb_game_id)
        const gamesToRemove = currentGames.filter(id => !gamesIds.includes(id))


        if (gamesToRemove.length > 0) {
            await collectionContent.destroy({
                where: {
                    game_collection_id: gameCollectionId,
                    igdb_game_id: gamesToRemove
                }
            })
        } else {
            res.status(200).json({message: `There are no games to remove.`})
            return
        }
        res.status(201).json({message: `Games removed from the collection : ${gamesToRemove}.`})
    } catch (error) {
        console.error('Error removing games from the collection:', error)
        res.status(500).json({message: 'Error removing games from the collection', error: error.message})
    }
}

module.exports = controller;
