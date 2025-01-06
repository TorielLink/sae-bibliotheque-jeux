const { status } = require('../database/sequelize');

const controller = {};

// Récupérer tous les statuts
controller.getAll = async (req, res) => {
    try {
        const statusData = await status.findAll();
        res.status(200).json({ message: 'Status fetched successfully', data: statusData });
    } catch (error) {
        console.error('Error fetching status:', error);
        res.status(500).json({ message: 'Error fetching status', error: error.message });
    }
};

module.exports = controller;
