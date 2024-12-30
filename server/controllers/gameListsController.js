const {gameList, listContent, users, userLists} = require('../database/sequelize');
const DataRetriever = require('../services/DataRetriever.js');
require('dotenv').config();
const controller = {};

// Créer une nouvelle liste de jeux
controller.createGameList = async (req, res) => {
    try {
        const {name, description} = req.body;
        const userId = req.user?.id; // ID de l'utilisateur connecté (via middleware)

        if (!userId) {
            return res.status(400).json({message: 'User ID is required to create a game list'});
        }

        // Créer la liste de jeux
        const newList = await gameList.create({name, description});

        // Associer la liste à l'utilisateur dans user_lists
        await userLists.create({
            user_id: userId,
            game_list_id: newList.game_list_id, // Utilise l'ID de la liste nouvellement créée
        });

        res.status(201).json({message: 'Game list created and associated successfully', data: newList});
    } catch (error) {
        console.error('Error creating game list:', error);
        res.status(500).json({message: 'Error creating game list', error: error.message});
    }
};

// Modifier le nom ou la description d'une liste
controller.updateGameList = async (req, res) => {
    try {
        const {id} = req.params; // ID de la liste
        const {name, description} = req.body; // Champs à mettre à jour
        const userId = req.user?.id; // ID de l'utilisateur connecté (via middleware)

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
        if (name !== undefined) updateData.name = name; // Ajouter `name` s'il est présent dans le body
        if (description !== undefined) updateData.description = description; // Ajouter `description` s'il est présent dans le body

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
        const {id} = req.params; // ID de la liste
        const userId = req.user?.id; // ID de l'utilisateur connecté (via middleware)

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

        // Supprimer la liste de la table userLists
        await userLists.destroy({
            where: {
                game_list_id: id,
                user_id: userId
            }
        });

        // Supprimer la liste de la table gameLists (si plus personne n'y est associé)
        const remainingAssociations = await userLists.count({
            where: {game_list_id: id}
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

// Récupérer les listes d'un utilisateur avec leurs jeux enrichis depuis l'API IGDB
controller.getListsByUser = async (req, res) => {
    try {
        const {id} = req.params; // ID utilisateur

        // Vérifiez que l'ID utilisateur est fourni
        if (!id) {
            return res.status(400).json({message: 'User ID is required'});
        }

        // Récupérer les listes associées à l'utilisateur via userLists
        const lists = await gameList.findAll({
            include: [
                {
                    model: users,
                    as: 'users', // Alias défini dans les associations
                    where: {user_id: id},
                    attributes: [], // Nous n'avons besoin que de filtrer, pas de retourner les données utilisateur
                    through: {attributes: []}, // Exclut les colonnes de la table de liaison
                },
                {
                    model: listContent,
                    as: 'contents',
                    attributes: ['igdb_game_id'],
                },
            ],
        });

        if (!lists || lists.length === 0) {
            return res.status(404).json({message: 'No game lists found for this user'});
        }

        // Ajouter l'enrichissement via l'API IGDB
        const clientId = process.env.CLIENT_ID;
        const accessToken = process.env.ACCESS_TOKEN;
        const dataRetriever = new DataRetriever(clientId, accessToken);

        const enrichedLists = await Promise.all(
            lists.map(async (list) => {
                const enrichedGames = await Promise.all(
                    list.contents.map(async (content) => {
                        const igdbGameId = content.igdb_game_id;
                        try {
                            const gameInfo = await dataRetriever.getGameInfo(igdbGameId);
                            return {
                                igdb_game_id: igdbGameId,
                                title: gameInfo?.name || null,
                                cover: gameInfo?.cover?.url || null,
                                releaseDate: gameInfo?.releaseDate || null,
                                genres: gameInfo?.genres || [],
                            };
                        } catch (error) {
                            console.error(`Error retrieving game data for IGDB ID: ${igdbGameId}`, error.message);
                            return {
                                igdb_game_id: igdbGameId,
                                error: 'Could not retrieve game data',
                            };
                        }
                    })
                );

                return {
                    id: list.id,
                    name: list.name,
                    description: list.description,
                    games: enrichedGames,
                };
            })
        );

        res.status(200).json({
            message: 'Game lists with enriched game data fetched successfully',
            data: enrichedLists,
        });
    } catch (error) {
        console.error('Error fetching game lists by user:', error);
        res.status(500).json({message: 'Error fetching game lists by user', error: error.message});
    }
};

// Récupérer les détails d'une liste de jeux avec les informations enrichies des jeux
controller.getGameListWithDetails = async (req, res) => {
    try {
        const {id} = req.params; // ID de la liste
        const userId = req.user?.id; // ID de l'utilisateur connecté

        if (!userId) {
            return res.status(400).json({message: 'User ID is required'});
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

        // Récupérer les contenus de la liste
        const listWithContents = await gameList.findOne({
            where: {game_list_id: id},
            include: {
                model: listContent,
                as: 'contents', // Alias défini dans Sequelize
                attributes: ['igdb_game_id'], // Champs spécifiques des contenus
            },
            attributes: ['game_list_id', 'name', 'description'], // Champs spécifiques de la liste
        });

        if (!listWithContents || listWithContents.contents.length === 0) {
            return res.status(404).json({message: 'No games found for this list'});
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

        res.status(200).json({message: 'Game list with details fetched successfully', data: responseData});
    } catch (error) {
        console.error('Error fetching game list with details:', error);
        res.status(500).json({message: 'Error fetching game list with details', error: error.message});
    }
};

// Ajouter un jeu à une liste en fonction de l'ID de la liste
controller.addGameToList = async (req, res) => {
    try {
        const {id} = req.params; // ID de la liste
        const {igdb_game_id} = req.body; // ID du jeu à ajouter
        const userId = req.user?.id; // ID de l'utilisateur connecté

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

