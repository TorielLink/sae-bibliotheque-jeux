const {gameList, listContent, users, userLists} = require('../database/sequelize');
const DataRetriever = require('../services/DataRetriever.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const controller = {};

// Initialiser DataRetriever avec les clés d'API IGDB
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;
const dataRetriever = new DataRetriever(clientId, accessToken);

if (!clientId || !accessToken) {
    console.error("CLIENT_ID or ACCESS_TOKEN missing in .env");
    process.exit(1);
}

// Mise en place d'un cache pour éviter les appels redondants
const gameCache = new Map();

// Fonction pour récupérer les données d'un jeu à partir de l'API IGDB
async function getGameData(igdb_game_id) {
    if (gameCache.has(igdb_game_id)) {
        return gameCache.get(igdb_game_id);
    }

    try {
        const gameData = await dataRetriever.getGameInfo(igdb_game_id);
        if (gameData) {
            gameCache.set(igdb_game_id, gameData);
            return gameData;
        }
    } catch (error) {
        console.error(`Error fetching game data for ${igdb_game_id}:`, error.message);
    }

    return {name: 'Titre inconnu', cover: {url: null}};
}

// fonction pour formater la date en français
const formatDateToFrench = (date) => {
    if (!date) return null;

    const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
};

// Récupérer la liste des jeux avec les détails
controller.getGameListWithDetails = async (req, res) => {
    try {
        const {idList} = req.params;
        const userId = req.user?.user_id;

        if (!userId) {
            return res.status(400).json({message: 'User ID is required'});
        }

        // Vérifier que la liste appartient à l'utilisateur via la table userLists
        const userList = await userLists.findOne({
            where: {
                game_list_id: idList,
                user_id: userId,
            },
        });

        if (!userList) {
            return res.status(404).json({message: 'Game list not found or not owned by user'});
        }

        // Récupérer les contenus de la liste
        const listWithContents = await gameList.findOne({
            where: {game_list_id: idList},
            include: {
                model: listContent,
                as: 'contents',
                attributes: ['igdb_game_id'],
            },
            attributes: ['game_list_id', 'name', 'description'],
        });

        if (!listWithContents || listWithContents.contents.length === 0) {
            return res.status(404).json({message: 'No games found for this list'});
        }

        // Récupérer les informations enrichies pour chaque jeu
        const enrichedGames = await Promise.all(
            listWithContents.contents.map(async (content) => {
                const igdbGameId = content.igdb_game_id;
                try {
                    const gameInfo = await getGameData(igdbGameId);
                    return {
                        igdb_game_id: igdbGameId,
                        title: gameInfo.name,
                        cover: gameInfo.cover?.url || null,
                        releaseDate: formatDateToFrench(gameInfo.releaseDate) || null,
                        genres: gameInfo.genres || [],
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

        res.status(200).json({
            message: 'Game list with details fetched successfully',
            data: responseData,
        });
    } catch (error) {
        console.error('Error fetching game list with details:', error);
        res.status(500).json({
            message: 'Error fetching game list with details',
            error: error.message,
        });
    }
};

// Récupérer les listes de jeux de l'utilisateur
controller.getUserGameLists = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(400).json({message: 'Utilisateur non identifié'});
        }

        const userGameLists = await gameList.findAll({
            attributes: ['game_list_id', 'name'],
            include: [
                {
                    model: listContent,
                    as: 'contents',
                    attributes: ['igdb_game_id'],
                },
                {
                    model: userLists,
                    as: 'user_lists',
                    where: {user_id: userId},
                    attributes: [],
                },
            ],
        });

        if (!userGameLists || userGameLists.length === 0) {
            return res.status(404).json({message: 'Aucune liste trouvée pour cet utilisateur'});
        }

        // Récupérer les données des jeux à partir de l'API IGDB
        const gameDataPromises = userGameLists.flatMap(list =>
            list.contents.map(async content => {
                const gameData = await getGameData(content.igdb_game_id);
                return {
                    igdb_game_id: content.igdb_game_id,
                    title: gameData.name,
                    cover: gameData.cover?.url || null,
                };
            })
        );

        const enrichedGames = await Promise.all(gameDataPromises);

        const responseData = userGameLists.map(list => ({
            game_list_id: list.game_list_id,
            name: list.name,
            games: list.contents.map(content => {
                const gameDetails = enrichedGames.find(game => game.igdb_game_id === content.igdb_game_id);
                return gameDetails || {igdb_game_id: content.igdb_game_id, title: 'Titre inconnu', cover: null};
            }),
        }));

        res.status(200).json({
            message: 'Listes récupérées avec succès',
            data: responseData,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des listes de jeux :', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des listes de jeux',
            error: error.message,
        });
    }
};

// Créer une nouvelle liste de jeux
controller.createGameList = async (req, res) => {
    try {
        const {name, description} = req.body;
        const userId = req.user?.user_id;

        if (!userId) {
            return res.status(400).json({message: 'User ID is required to create a game list'});
        }

        const newList = await gameList.create({name, description});

        await userLists.create({
            user_id: userId,
            game_list_id: newList.game_list_id,
        });

        res.status(201).json({message: 'Game list created successfully', data: newList});
    } catch (error) {
        console.error('Error creating game list:', error);
        res.status(500).json({message: 'Error creating game list', error: error.message});
    }
};

// Modifier le nom ou la description d'une liste
controller.updateGameList = async (req, res) => {
    try {
        const {id} = req.params; // ID de la liste
        const {name, description} = req.body;
        const userId = req.user?.user_id;

        if (!userId) {
            return res.status(400).json({message: 'User ID is required'});
        }

        // Vérifier si la liste appartient à l'utilisateur via la table userLists
        const userList = await userLists.findOne({
            where: {
                game_list_id: id,
                user_id: userId
            }
        });

        if (!userList) {
            return res.status(404).json({message: 'Game list not found or not owned by user'});
        }

        // Construire l'objet des champs à mettre à jour dynamiquement
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({message: 'No fields provided for update'});
        }

        // Mettre à jour la liste dans la table gameLists
        const updatedList = await gameList.update(updateData, {
            where: {game_list_id: id}
        });

        if (!updatedList[0]) {
            return res.status(404).json({message: 'Game list could not be updated'});
        }

        res.status(200).json({message: 'Game list updated successfully'});
    } catch (error) {
        console.error('Error updating game list:', error);
        res.status(500).json({message: 'Error updating game list', error: error.message});
    }
};

// Supprimer une liste de jeux
controller.deleteGameList = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user?.user_id;

        if (!userId) {
            return res.status(400).json({message: 'User ID is required'});
        }

        // Vérifier si la liste appartient à l'utilisateur via la table userLists
        const userList = await userLists.findOne({
            where: {
                game_list_id: id,
                user_id: userId,
            },
        });

        if (!userList) {
            return res.status(404).json({message: 'Game list not found or not owned by user'});
        }

        // Supprimer la liste de la table userLists
        await userLists.destroy({
            where: {
                game_list_id: id,
                user_id: userId,
            },
        });

        // Supprimer la liste de la table gameLists (si plus personne n'y est associé)
        const remainingAssociations = await userLists.count({
            where: {game_list_id: id},
        });

        if (remainingAssociations === 0) {
            await gameList.destroy({where: {game_list_id: id}});
        }

        res.status(200).json({message: 'Game list deleted successfully'});
    } catch (error) {
        console.error('Error deleting game list:', error);
        res.status(500).json({message: 'Error deleting game list', error: error.message});
    }
};

// Ajouter un jeu à une liste en fonction de l'ID de la liste
controller.addGameToList = async (req, res) => {
    try {
        const {id} = req.params;
        const {igdb_game_id} = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({message: 'User ID is required'});
        }

        if (!igdb_game_id) {
            return res.status(400).json({message: 'IGDB Game ID is required'});
        }

        // Vérifier que la liste appartient à l'utilisateur via la table userLists
        const userList = await userLists.findOne({
            where: {
                game_list_id: id,
                user_id: userId
            }
        });

        if (!userList) {
            return res.status(404).json({message: 'Game list not found or not owned by user'});
        }

        // Vérifier si le jeu existe déjà dans la liste
        const existingGame = await listContent.findOne({
            where: {
                game_list_id: id,
                igdb_game_id
            }
        });

        if (existingGame) {
            return res.status(400).json({
                message: 'Game already exists in the list',
                data: {
                    game_list_id: id,
                    igdb_game_id
                }
            });
        }

        // Ajouter le jeu à la liste
        const newGame = await listContent.create({
            game_list_id: id,
            igdb_game_id
        });

        res.status(201).json({
            message: 'Game added to list successfully',
            data: {
                game_list_id: id,
                igdb_game_id
            }
        });
    } catch (error) {
        console.error('Error adding game to list:', error);
        res.status(500).json({message: 'Error adding game to list', error: error.message});
    }
};

module.exports = controller;

