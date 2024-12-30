const {
    gameLogs,
    gameStatus,
    status,
    gamePlatforms,
    gameSession,
    gameRatings, sequelize, users,
} = require('../database/sequelize');
const DataRetriever = require('../services/DataRetriever.js');
require('dotenv').config();

// Chargement des variables d'environnement pour l'API IGDB

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

// Fonction pour formater les dates en français (JJ-MM-AAAA)
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

        // Vérification des paramètres nécessaires
        if (!userId || !gameStatusName) {
            return res.status(400).json({message: 'userId et gameStatusName sont requis.'});
        }

        // Ajouter un log pour vérifier les paramètres reçus
        console.log(`Récupération des jeux pour l'utilisateur ID: ${userId} avec le statut: ${gameStatusName}`);

        // Récupérer les gameStatus pour l'utilisateur donné et le statut spécifié
        const gameStatuses = await gameStatus.findAll({
            where: {
                user_id: userId, // Filtrage par userId
            },
            include: [
                {
                    model: status,
                    as: 'status',
                    where: {name: gameStatusName}, // Filtrage par gameStatusName via l'association avec status
                    attributes: ['name'],
                    required: true, // Assure que seul les gameStatus avec ce statut sont récupérés
                },
                {
                    model: gameRatings,
                    as: 'ratings',
                    attributes: ['rating_value'], // Récupérer uniquement la note de l'utilisateur
                    required: false, // Permet de récupérer les jeux même sans note
                },
                {
                    model: gameLogs,
                    as: 'status_game_logs', // Alias pour l'association avec game_logs
                    include: [
                        {
                            model: gameSession,
                            as: 'game_sessions', // Alias pour l'association avec game_sessions
                            attributes: ['session_date', 'time_played'], // Récupérer le temps joué et la date de session
                        },
                        {
                            model: gamePlatforms,
                            as: 'platform', // Alias pour l'association avec gamePlatforms
                            attributes: ['name'], // Récupérer le nom de la plateforme
                        }
                    ],
                    attributes: ['igdb_game_id'],
                    required: false, // Permet de récupérer les jeux même sans logs
                },
            ],
            attributes: ['igdb_game_id', 'user_id'],
            distinct: true, // Pour éviter les doublons si associations multiples
        });

        // Vérifier si des jeux ont été trouvés
        if (!gameStatuses || gameStatuses.length === 0) {
            return res.status(404).json({message: 'Aucun jeu trouvé pour cet utilisateur et ce statut.'});
        }

        // Enrichir les données avec des informations supplémentaires sur le jeu via l'API IGDB
        const clientId = process.env.CLIENT_ID;
        const accessToken = process.env.ACCESS_TOKEN;
        const dataRetriever = new DataRetriever(clientId, accessToken);

        const enrichedGames = await Promise.all(
            gameStatuses.map(async (entry) => {
                const igdbGameId = entry.igdb_game_id;
                let gameInfo = null;

                try {
                    gameInfo = await dataRetriever.getGameInfo(igdbGameId); // Récupérer les informations du jeu depuis l'API IGDB
                } catch (error) {
                    console.error(`Erreur lors de la récupération des informations du jeu ID: ${igdbGameId}`, error.message);
                }

                // Récupération de la note de l'utilisateur
                const userRating = entry.ratings?.[0]?.rating_value || null; // Récupérer la note de l'utilisateur

                // Récupérer toutes les sessions de jeu pour ce jeu et statut
                const gameSessions = entry.status_game_logs?.flatMap(log => log.game_sessions) || [];
                const lastSessionDate = gameSessions.length > 0
                    ? gameSessions.reduce((latest, session) => {
                        return new Date(session.session_date) > new Date(latest) ? session.session_date : latest;
                    }, gameSessions[0].session_date)
                    : null;

                // Calculer le total du temps joué pour ce jeu
                const totalTimePlayed = gameSessions.reduce((total, session) => {
                    return total + (session.time_played || 0); // Additionner le temps joué dans chaque session
                }, 0);

                // Calculer le nombre de sessions
                const sessionCount = gameSessions.length; // Compter le nombre de sessions

                // Calculer la note moyenne des utilisateurs pour ce jeu
                const avgRatingResult = await gameRatings.findOne({
                    where: {igdb_game_id: igdbGameId},
                    attributes: [
                        [sequelize.fn('AVG', sequelize.col('rating_value')), 'averageRating'], // Calcul de la moyenne
                    ],
                    raw: true,
                });

                const averageRating = avgRatingResult ? parseFloat(avgRatingResult.averageRating).toFixed(2) : null;

                // Récupérer le nom de la plateforme
                const platformName = entry.status_game_logs?.[0]?.platform?.name || null;

                // Formater les dates en version française
                const formattedReleaseDate = formatDateToFrench(gameInfo?.releaseDate);
                const formattedLastSessionDate = formatDateToFrench(lastSessionDate);

                // Renvoi des données concernant le jeu, la note de l'utilisateur, la dernière session, la moyenne des évaluations, et le nom de la plateforme
                return {
                    igdb_game_id: igdbGameId,
                    title: gameInfo?.name || null,
                    cover: gameInfo?.cover?.url || null,
                    releaseDate: formattedReleaseDate, // Date de sortie formatée en français
                    genres: gameInfo?.genres || [],
                    userRating: userRating, // Note de l'utilisateur
                    lastSessionDate: formattedLastSessionDate, // Dernière session formatée en français
                    averageRating: averageRating, // Moyenne des évaluations des utilisateurs
                    totalTimePlayed: totalTimePlayed, // Temps total joué
                    sessionCount: sessionCount, // Nombre total de sessions
                    platform: platformName, // Nom de la plateforme
                };
            })
        );

        // Renvoi de la réponse avec les jeux enrichis
        res.status(200).json({
            message: 'Jeux, notes, sessions, moyenne, temps, plateforme et dates récupérés avec succès',
            data: enrichedGames
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des jeux avec sessions:', error);
        res.status(500).json({message: 'Erreur serveur', error: error.message});
    }
};

module.exports = controller;

