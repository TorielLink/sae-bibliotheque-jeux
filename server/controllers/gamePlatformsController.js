const { gamePlatforms } = require('../database/sequelize');

const controller = {};

// Récupérer toutes les plateformes de jeu
controller.getAll = async (req, res) => {
    try {
        const platforms = await gamePlatforms.findAll();
        res.status(200).json({ message: 'Game platforms fetched successfully', data: platforms });
    } catch (error) {
        console.error('Error fetching game platforms:', error);
        res.status(500).json({ message: 'Error fetching game platforms', error: error.message });
    }
};

module.exports = controller;
