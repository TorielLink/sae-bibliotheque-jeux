const { gameReview, privacySettings } = require('../database/sequelize');

const controller = {};

// Récupérer toutes les critiques avec leurs paramètres de confidentialité
controller.getAllReviews = async (req, res) => {
    try {
        const reviews = await gameReview.findAll({
            include: {
                model: privacySettings, // Modèle lié
                as: 'review_privacy', // Alias défini dans Sequelize
                attributes: ['name'], // Champs spécifiques de privacy_settings
            },
        });
        res.status(200).json({ message: 'Reviews fetched successfully', data: reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Récupérer les critiques pour un utilisateur spécifique
controller.getReviewsByUserId = async (req, res) => {
    try {
        const { id } = req.params; // ID de l'utilisateur
        const reviews = await gameReview.findAll({
            where: { user_id: id },
            include: {
                model: privacySettings,
                as: 'review_privacy',
                attributes: ['name'], // Champs spécifiques de privacy_settings
            },
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this user' });
        }

        res.status(200).json({ message: 'User reviews fetched successfully', data: reviews });
    } catch (error) {
        console.error('Error fetching reviews by user ID:', error);
        res.status(500).json({ message: 'Error fetching reviews by user ID', error: error.message });
    }
};

// Récupérer les critiques pour un jeu spécifique avec paramètres de confidentialité
controller.getReviewsByGameId = async (req, res) => {
    try {
        const { id } = req.params; // ID du jeu (igdb_game_id)
        const reviews = await gameReview.findAll({
            where: { igdb_game_id: id },
            include: {
                model: privacySettings,
                as: 'review_privacy',
                attributes: ['name'], // Champs spécifiques de privacy_settings
            },
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this game' });
        }

        res.status(200).json({ message: 'Game reviews fetched successfully', data: reviews });
    } catch (error) {
        console.error('Error fetching reviews by game ID:', error);
        res.status(500).json({ message: 'Error fetching reviews by game ID', error: error.message });
    }
};

module.exports = controller;
