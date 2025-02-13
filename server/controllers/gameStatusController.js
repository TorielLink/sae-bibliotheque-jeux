const {
    gameLogs,
    gameStatus,
    status,
    gamePlatforms,
    gameSession,
    gameRatings,
    sequelize,
    users,
} = require('../database/sequelize');
const DataRetriever = require('../services/DataRetriever.js');
require('dotenv').config();

const controller = {};

// Initialisation du service DataRetriever
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;
const dataRetriever = new DataRetriever(clientId, accessToken);

if (!clientId || !accessToken) {
    console.error("CLIENT_ID or ACCESS_TOKEN missing in .env");
    process.exit(1);
}

// Mise en place d'un cache local pour éviter les appels redondants
const gameCache = new Map();

const formatDateToFrench = (date) => {
    if (!date) return null;

    const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
};

controller.getGamesWithSessions = async (req, res) => {
    try {
        const {userId, gameStatusName} = req.query;

        if (!userId || !gameStatusName) {
            return res.status(400).json({message: 'userId et gameStatusName sont requis.'});
        }

        console.log(`Récupération des jeux pour l'utilisateur ID: ${userId} avec le statut: ${gameStatusName}`);

        // Fetch game statuses with logs and sessions
        const gameStatuses = await gameStatus.findAll({
            where: {user_id: userId},
            include: [
                {
                    model: status,
                    as: 'status',
                    where: {name: gameStatusName},
                    attributes: ['name'],
                    required: true,
                },
                {
                    model: gameRatings,
                    as: 'ratings',
                    attributes: ['rating_value'],
                    required: false,
                },
                {
                    model: gameLogs,
                    as: 'status_game_logs',
                    include: [
                        {
                            model: gameSession,
                            as: 'game_sessions',
                            attributes: ['session_date'],
                        },
                        {
                            model: gamePlatforms,
                            as: 'platform',
                            attributes: ['name'],
                        },
                    ],
                    attributes: ['time_played', 'igdb_game_id'],
                    required: false,
                },
            ],
            attributes: ['igdb_game_id', 'user_id'],
            distinct: true,
        });

        if (!gameStatuses || gameStatuses.length === 0) {
            return res.status(404).json({message: 'Aucun jeu trouvé pour cet utilisateur et ce statut.'});
        }

        const gameIds = gameStatuses.map((entry) => entry.igdb_game_id);

        // Fetch additional game info from DataRetriever
        const gamesInfo = await dataRetriever.getGameList(gameIds);

        const enrichedGames = gameStatuses.map((entry) => {
            const gameInfo = gamesInfo.find((game) => game.id === entry.igdb_game_id) || {};
            const logs = entry.status_game_logs || [];

            // Calculate total time played by summing all logs' time_played
            const totalTimePlayed = logs.reduce((total, log) => total + (log.time_played || 0), 0);

            // Calculate average rating
            const ratings = entry.ratings || [];
            const averageRating =
                ratings.length > 0
                    ? ratings.reduce((sum, rating) => sum + rating.rating_value, 0) / ratings.length
                    : null;

            return {
                igdb_game_id: entry.igdb_game_id,
                title: gameInfo.name || 'Titre inconnu',
                cover: gameInfo.cover || null,
                releaseDate: formatDateToFrench(gameInfo.releaseDate),
                genres: gameInfo.genres || [],
                userRating: entry.ratings?.[0]?.rating_value || null,
                averageRating: averageRating ? averageRating.toFixed(1) : null, // Format the average to 1 decimal place
                lastSessionDate: formatDateToFrench(
                    logs.reduce(
                        (latest, log) =>
                            new Date(log.game_sessions?.[0]?.session_date) > new Date(latest)
                                ? log.game_sessions?.[0]?.session_date
                                : latest,
                        null
                    )
                ),
                totalTimePlayed, // Correctly summed time played
                sessionCount: logs.flatMap((log) => log.game_sessions || []).length || 0,
                platform: logs[0]?.platform?.name || 'Non spécifiée',
            };
        });

        res.status(200).json({
            message: 'Jeux, notes, sessions, moyenne, temps, plateforme et dates récupérés avec succès',
            data: enrichedGames,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des jeux avec sessions:', error);
        res.status(500).json({message: 'Erreur serveur', error: error.message});
    }
};
// Récupérer tous les statuts de jeu avec leur statut générique associé
controller.getAllGameStatuses = async (req, res) => {
    try {
        const gameStatuses = await gameStatus.findAll({
            include: {
                model: status,
                as: 'status',
                attributes: ['game_status_id', 'name', 'icon'],
            },
        });
        res.status(200).json({message: 'Game statuses fetched successfully', data: gameStatuses});
    } catch (error) {
        console.error('Error fetching game statuses:', error);
        res.status(500).json({message: 'Error fetching game statuses', error: error.message});
    }
};

// Récupérer les statuts de jeu pour un utilisateur spécifique
controller.getGameStatusesByUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const userGameStatuses = await gameStatus.findAll({
            where: {user_id: userId},
            include: {
                model: status,
                as: 'status',
                attributes: ['game_status_id', 'name', 'icon'],
            },
        });

        if (!userGameStatuses || userGameStatuses.length === 0) {
            return res.status(404).json({message: 'No game statuses found for this user'});
        }

        res.status(200).json({message: 'User game statuses fetched successfully', data: userGameStatuses});
    } catch (error) {
        console.error('Error fetching user game statuses:', error);
        res.status(500).json({message: 'Error fetching user game statuses', error: error.message});
    }
};

// Récupérer les statuts de jeu pour un jeu spécifique
controller.getGameStatusesByGame = async (req, res) => {
    try {
        const {igdb_game_id} = req.params;
        const gameStatuses = await gameStatus.findAll({
            where: {igdb_game_id: igdb_game_id},
            include: {
                model: status,
                as: 'status',
                attributes: ['game_status_id', 'name', 'icon'],
            },
        });

        if (!gameStatuses || gameStatuses.length === 0) {
            return res.status(404).json({message: 'No game statuses found for this game'});
        }

        res.status(200).json({message: 'Game statuses fetched successfully', data: gameStatuses});
    } catch (error) {
        console.error('Error fetching game statuses by game ID:', error);
        res.status(500).json({message: 'Error fetching game statuses by game ID', error: error.message});
    }
}

controller.getStatusByUserAndGame = async (req, res) => {
    try {
        const {userId, gameId} = req.params
        let gameStatusData = await gameStatus.findOne({
            where: {
                user_id: userId,
                igdb_game_id: gameId
            }
        });

        if (!gameStatusData) {
            gameStatusData = null
        }

        res.status(200).json({message: 'Game status fetched successfully', data: gameStatusData});
    } catch (error) {
        console.error('Error fetching game status :', error);
        res.status(500).json({message: 'Error fetching game status', error: error.message});
    }
}

controller.updateGameStatus = async (req, res) => {
    try {
        const {userId, gameId} = req.params
        const {game_status_id} = req.body

        if (!game_status_id) {
            return res.status(400).json({message: 'game_status_id is required'})
        }

        let game_status = await gameStatus.findOne({
            where: {
                user_id: userId,
                igdb_game_id: gameId,
            },
        })

        if (!game_status) {
            game_status = await gameStatus.create({
                user_id: Number(userId),
                igdb_game_id: Number(gameId),
                game_status_id: game_status_id,
            })

            return res.status(201).json({
                message: 'Game status created successfully',
                data: game_status,
            })
        }

        game_status.game_status_id = game_status_id

        await game_status.save()

        res.status(200).json({message: 'Game status updated successfully', data: game_status})
    } catch (error) {
        console.error('Error updating game status:', error)
        res.status(500).json({message: 'Error updating game status', error: error.message})
    }
}


module.exports = controller;
