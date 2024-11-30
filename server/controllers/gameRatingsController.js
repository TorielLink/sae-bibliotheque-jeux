const { gameRatings } = require('../database/sequelize');

const controller = {};

// Récupérer toutes les évaluations
controller.getAll = async (req, res) => {
    try {
        const ratings = await gameRatings.findAll();
        res.status(200).json({ message: 'Game ratings fetched successfully', data: ratings });
    } catch (error) {
        console.error('Error fetching game ratings:', error);
        res.status(500).json({ message: 'Error fetching game ratings', error: error.message });
    }
};
// TODO : vérifié le fonctionnement de la fonction Création et suppression
// Ajouter une nouvelle évaluation
controller.create = async (req, res) => {
    try {
        const { user_id, igdb_game_id, rating_value, privacy_setting_id } = req.body;

        const newRating = await gameRatings.create({
            user_id,
            igdb_game_id,
            rating_value,
            privacy_setting_id
        });

        res.status(201).json({ message: 'Game rating created successfully', data: newRating });
    } catch (error) {
        console.error('Error creating game rating:', error);
        res.status(500).json({ message: 'Error creating game rating', error: error.message });
    }
};

// Supprimer une évaluation
controller.delete = async (req, res) => {
    try {
        const { user_id, igdb_game_id } = req.params;

        const deletedCount = await gameRatings.destroy({
            where: { user_id, igdb_game_id }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Game rating not found' });
        }

        res.status(200).json({ message: 'Game rating deleted successfully' });
    } catch (error) {
        console.error('Error deleting game rating:', error);
        res.status(500).json({ message: 'Error deleting game rating', error: error.message });
    }
};

module.exports = controller;
