const {collectionContent, gameCollections, userCollections} = require('../database/sequelize');

const controller = {};
const DataRetriever = require('../services/DataRetriever');


controller.getContentsByListId = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({message: 'User ID is required'});
        }

        // Vérifier que la liste appartient à l'utilisateur via la table userCollections
        const userList = await userCollections.findOne({
            where: {
                game_list_id: id,
                user_id: userId
            }
        });

        if (!userList) {
            return res.status(404).json({message: 'Game list not found or not owned by user'});
        }

        // Récupérer les contenus de la liste
        const listWithContents = await gameCollections.findOne({
            where: {game_list_id: id},
            include: {
                model: collectionContent,
                as: 'contents',
                attributes: ['igdb_game_id'],
            },
            attributes: ['game_list_id', 'name', 'description'],
        });

        if (!listWithContents) {
            return res.status(404).json({message: 'Game list not found'});
        }

        // Récupérer les informations enrichies pour chaque jeu
        const clientId = process.env.CLIENT_ID;
        const accessToken = process.env.ACCESS_TOKEN;
        const dataRetriever = new DataRetriever(clientId, accessToken);

        const enrichedGames = await Promise.all(
            listWithContents.contents.map(async (content) => {
                const igdbGameId = content.igdb_game_id;
                try {
                    const gameInfo = await dataRetriever.getGameInfo(igdbGameId); // Appel à l'API IGDB
                    return {
                        igdb_game_id: igdbGameId,
                        title: gameInfo?.name || null,
                        cover: gameInfo?.cover?.url || null,
                        releaseDate: gameInfo?.releaseDate || null,
                        genres: gameInfo?.genres || [],
                    };
                } catch (error) {
                    console.error(`Error retrieving data for IGDB ID: ${igdbGameId}`, error.message);
                    return {
                        igdb_game_id: igdbGameId,
                        error: 'Could not retrieve game data',
                    };
                }
            })
        );

        // Ajouter les jeux enrichis aux données de la liste
        const responseData = {
            game_list_id: listWithContents.game_list_id,
            name: listWithContents.name,
            description: listWithContents.description,
            games: enrichedGames,
        };

        res.status(200).json({message: 'Contents fetched successfully', data: responseData});
    } catch (error) {
        console.error('Error fetching contents by list ID:', error);
        res.status(500).json({message: 'Error fetching contents by list ID', error: error.message});
    }
};

module.exports = controller;
