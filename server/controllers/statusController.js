const { status } = require('../database/sequelize');

const controller = {};

// Récupérer tous les statuts
controller.getAll = async (req, res) => {
    try {
        const statuses = await status.findAll(); // Vérifie que `status` est bien importé
        res.status(200).json({ message: 'Statuses fetched successfully', data: statuses });
    } catch (error) {
        console.error('Error fetching statuses:', error);
        res.status(500).json({ message: 'Error fetching statuses', error: error.message });
    }
};

module.exports = controller;
