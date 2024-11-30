const { gameList } = require('../database/sequelize');

const controller = {};

// Récupérer toutes les listes de jeux
controller.getAll = async (req, res) => {
    try {
        const lists = await gameList.findAll();
        res.status(200).json({ message: 'Game lists fetched successfully', data: lists });
    } catch (error) {
        console.error('Error fetching game lists:', error);
        res.status(500).json({ message: 'Error fetching game lists', error: error.message });
    }
};

module.exports = controller;
