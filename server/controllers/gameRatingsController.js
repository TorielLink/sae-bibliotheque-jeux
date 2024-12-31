const {gameRatings, privacySettings} = require('../database/sequelize');
const {Op, fn, col} = require('sequelize');

const controller = {};

controller.getAverageRatingByGameId = async (req, res) => {
    try {
        const {id} = req.params;
        // On fait la moyenne de rating_value pour les évaluations du jeu {id}
        const result = await gameRatings.findOne({
            where: {igdb_game_id: id},
            attributes: [[fn('AVG', col('rating_value')), 'average']],
            raw: true
        });

        let average = result && result.average ? parseFloat(result.average).toFixed(2) : null;

        if (!average || isNaN(average)) {
            return res.status(404).json({
                message: 'No ratings found for this game',
            });
        }

        return res.status(200).json({
            message: 'Average rating fetched successfully',
            data: {average},
        });
    } catch (error) {
        console.error('Error fetching average rating:', error);
        return res.status(500).json({
            message: 'Error fetching average rating',
            error: error.message,
        });
    }
};

// Récupérer toutes les évaluations avec leurs paramètres de confidentialité
controller.getAllRatings = async (req, res) => {
    try {
        const ratings = await gameRatings.findAll({
            include: {
                model: privacySettings,
                as: 'rating_privacy',
                attributes: ['name'],
            },
        });

        res.status(200).json({message: 'Ratings fetched successfully', data: ratings});
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({message: 'Error fetching ratings', error: error.message});
    }
};

// Récupérer les évaluations pour un jeu spécifique
controller.getRatingsByGameId = async (req, res) => {
    try {
        const {id} = req.params;
        const ratings = await gameRatings.findAll({
            where: {igdb_game_id: id},
            include: {
                model: privacySettings,
                as: 'rating_privacy',
                attributes: ['name'],
            },
        });

        if (!ratings || ratings.length === 0) {
            return res.status(404).json({message: 'No ratings found for this game'});
        }

        res.status(200).json({message: 'Game ratings fetched successfully', data: ratings});
    } catch (error) {
        console.error('Error fetching ratings by game ID:', error);
        res.status(500).json({message: 'Error fetching ratings by game ID', error: error.message});
    }
};

// Récupérer les évaluations pour un utilisateur spécifique
controller.getRatingsByUserId = async (req, res) => {
    try {
        const {id} = req.params;
        const ratings = await gameRatings.findAll({
            where: {user_id: id},
            include: {
                model: privacySettings,
                as: 'rating_privacy',
                attributes: ['name'],
            },
        });

        if (!ratings || ratings.length === 0) {
            return res.status(404).json({message: 'No ratings found for this user'});
        }

        res.status(200).json({message: 'User ratings fetched successfully', data: ratings});
    } catch (error) {
        console.error('Error fetching ratings by user ID:', error);
        res.status(500).json({message: 'Error fetching ratings by user ID', error: error.message});
    }
};

module.exports = controller;
