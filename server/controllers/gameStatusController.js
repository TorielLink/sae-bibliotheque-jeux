const {
    gameLogs,
    gameStatus,
    status,
    gamePlatforms,
    gameSession,
    gameRatings, sequelize, users,
} = require('../database/sequelize');
const DataRetriever = require('../services/DataRetriever.js');

const controller = {};

// Récupérer tous les statuts de jeu avec leur statut générique associé
controller.getAllGameStatuses = async (req, res) => {
    try {
        const gameStatuses = await gameStatus.findAll({
            include: {
                model: status,
                as: 'status', // Alias pour l'association avec status
                attributes: ['game_status_id', 'name'], // Attributs de la table status
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
        const {userId} = req.params; // ID de l'utilisateur
        const userGameStatuses = await gameStatus.findAll({
            where: {user_id: userId},
            include: {
                model: status,
                as: 'status', // Alias pour l'association avec status
                attributes: ['game_status_id', 'name'], // Attributs de la table status
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
        const {igdb_game_id} = req.params; // ID du jeu (igdb_game_id)
        const gameStatuses = await gameStatus.findAll({
            where: {igdb_game_id: igdb_game_id},
            include: {
                model: status,
                as: 'status', // Alias pour l'association avec status
                attributes: ['game_status_id', 'name'], // Attributs de la table status
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
};


const formatDateToFrench = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Récupérer les jeux par statut spécifique pour un utilisateur
controller.getGamesWithSessions = async (req, res) => {
    try {
        const {userId, gameStatusName} = req.query;

        if (!userId || !gameStatusName) {
            return res.status(400).json({message: 'userId et gameStatusName sont requis.'});
        }

        // Étape 1 : Récupérer les jeux avec le statut spécifique
        const gameStatuses = await gameStatus.findAll({
            where: {user_id: userId},
            include: [
                {
                    model: status,
                    as: 'status',
                    where: {name: gameStatusName},
                    attributes: ['name'],
                },
                {
                    model: gameLogs,
                    as: 'status_game_logs',
                    include: [
                        {
                            model: gameSession,
                            as: 'game_sessions',
                            attributes: ['session_date', 'time_played'],
                            order: [['session_date', 'DESC']], // Trier les sessions par date décroissante
                            limit: 1, // Récupérer uniquement la dernière session
                        },
                        {
                            model: gamePlatforms,
                            as: 'platform',
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            attributes: ['igdb_game_id', 'user_id'],
        });

        if (!gameStatuses || gameStatuses.length === 0) {
            return res.status(404).json({message: 'Aucun jeu trouvé pour cet utilisateur et ce statut.'});
        }

        // Étape 2 : Construire la réponse enrichie
        const enrichedGames = gameStatuses.map((entry) => {
            const gameLog = (entry.status_game_logs && entry.status_game_logs[0]) || {};
            const lastSession = (gameLog.game_sessions && gameLog.game_sessions[0]) || {};

            return {
                igdb_game_id: entry.igdb_game_id,
                platform: gameLog.platform?.name || null,
                lastSessionDate: formatDateToFrench(lastSession.session_date), // Formatage en français
                timePlayed: lastSession.time_played || 0,
            };
        });

        res.status(200).json({message: 'Jeux récupérés avec succès', data: enrichedGames});
    } catch (error) {
        console.error('Erreur lors de la récupération des jeux avec sessions:', error);
        res.status(500).json({message: 'Erreur serveur', error: error.message});
    }
};


module.exports = controller;

