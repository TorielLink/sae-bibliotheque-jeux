const { gameReview } = require('../database/sequelize');

const controller = {};

// Récupérer toutes les critiques de jeux
controller.getAll = async (req, res) => {
    try {
        const reviews = await gameReview.findAll();
        res.status(200).json({ message: 'Game reviews fetched successfully', data: reviews });
    } catch (error) {
        console.error('Error fetching game reviews:', error);
        res.status(500).json({ message: 'Error fetching game reviews', error: error.message });
    }
};

module.exports = controller;
