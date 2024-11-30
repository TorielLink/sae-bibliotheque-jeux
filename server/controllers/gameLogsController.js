const { gameLogs } = require('../database/sequelize');

const controller = {};

// Récupérer tous les journaux de jeux
controller.getAll = async (req, res) => {
    try {
        const logs = await gameLogs.findAll();
        res.status(200).json({ message: 'Game logs fetched successfully', data: logs });
    } catch (error) {
        console.error('Error fetching game logs:', error);
        res.status(500).json({ message: 'Error fetching game logs', error: error.message });
    }
};

module.exports = controller;
