const { gameStatus, status } = require('../database/sequelize'); // Assurez-vous d'importer les bons modèles

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
        res.status(200).json({ message: 'Game statuses fetched successfully', data: gameStatuses });
    } catch (error) {
        console.error('Error fetching game statuses:', error);
        res.status(500).json({ message: 'Error fetching game statuses', error: error.message });
    }
};

// Récupérer les statuts de jeu pour un utilisateur spécifique
controller.getGameStatusesByUser = async (req, res) => {
    try {
        const { userId } = req.params; // ID de l'utilisateur
        const userGameStatuses = await gameStatus.findAll({
            where: { user_id: userId },
            include: {
                model: status,
                as: 'status', // Alias pour l'association avec status
                attributes: ['game_status_id', 'name'], // Attributs de la table status
            },
        });

        if (!userGameStatuses || userGameStatuses.length === 0) {
            return res.status(404).json({ message: 'No game statuses found for this user' });
        }

        res.status(200).json({ message: 'User game statuses fetched successfully', data: userGameStatuses });
    } catch (error) {
        console.error('Error fetching user game statuses:', error);
        res.status(500).json({ message: 'Error fetching user game statuses', error: error.message });
    }
};

// Récupérer les statuts de jeu pour un jeu spécifique
controller.getGameStatusesByGame = async (req, res) => {
    try {
        const { igdb_game_id } = req.params; // ID du jeu (igdb_game_id)
        const gameStatuses = await gameStatus.findAll({
            where: { igdb_game_id: igdb_game_id },
            include: {
                model: status,
                as: 'status', // Alias pour l'association avec status
                attributes: ['game_status_id', 'name'], // Attributs de la table status
            },
        });

        if (!gameStatuses || gameStatuses.length === 0) {
            return res.status(404).json({ message: 'No game statuses found for this game' });
        }

        res.status(200).json({ message: 'Game statuses fetched successfully', data: gameStatuses });
    } catch (error) {
        console.error('Error fetching game statuses by game ID:', error);
        res.status(500).json({ message: 'Error fetching game statuses by game ID', error: error.message });
    }
};

module.exports = controller;
