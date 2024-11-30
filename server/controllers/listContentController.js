const { listContent } = require('../database/sequelize');

const controller = {};

// Récupérer tous les contenus des listes
controller.getAll = async (req, res) => {
    try {
        const content = await listContent.findAll();
        res.status(200).json({ message: 'List content fetched successfully', data: content });
    } catch (error) {
        console.error('Error fetching list content:', error);
        res.status(500).json({ message: 'Error fetching list content', error: error.message });
    }
};

module.exports = controller;
