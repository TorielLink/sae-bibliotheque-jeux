const { gameRatings, privacySettings } = require('../database/sequelize');

const controller = {};

// Récupérer toutes les évaluations avec leurs paramètres de confidentialité
controller.getAllRatings = async (req, res) => {
    try {
        const ratings = await gameRatings.findAll({
            include: {
                model: privacySettings,
                as: 'rating_privacy',
                attributes: ['name'], // Champs spécifiques de privacy_settings
            },
        });

        res.status(200).json({ message: 'Ratings fetched successfully', data: ratings });
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ message: 'Error fetching ratings', error: error.message });
    }
};

// Récupérer les évaluations pour un jeu spécifique
controller.getRatingsByGameId = async (req, res) => {
    try {
        const { id } = req.params; // ID du jeu (igdb_game_id)
        const ratings = await gameRatings.findAll({
            where: { igdb_game_id: id },
            include: {
                model: privacySettings,
                as: 'rating_privacy',
                attributes: ['name'], // Champs spécifiques de privacy_settings
            },
        });

        if (!ratings || ratings.length === 0) {
            return res.status(404).json({ message: 'No ratings found for this game' });
        }

        res.status(200).json({ message: 'Game ratings fetched successfully', data: ratings });
    } catch (error) {
        console.error('Error fetching ratings by game ID:', error);
        res.status(500).json({ message: 'Error fetching ratings by game ID', error: error.message });
    }
};

// Récupérer les évaluations pour un utilisateur spécifique
controller.getRatingsByUserId = async (req, res) => {
    try {
        const { id } = req.params; // ID de l'utilisateur
        const ratings = await gameRatings.findAll({
            where: { user_id: id },
            include: {
                model: privacySettings,
                as: 'rating_privacy',
                attributes: ['name'], // Champs spécifiques de privacy_settings
            },
        });

        if (!ratings || ratings.length === 0) {
            return res.status(404).json({ message: 'No ratings found for this user' });
        }

        res.status(200).json({ message: 'User ratings fetched successfully', data: ratings });
    } catch (error) {
        console.error('Error fetching ratings by user ID:', error);
        res.status(500).json({ message: 'Error fetching ratings by user ID', error: error.message });
    }
};

module.exports = controller;
