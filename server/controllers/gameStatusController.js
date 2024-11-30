const { gameStatus } = require('../database/sequelize');

const controller = {};

// Récupérer tous les statuts des jeux
controller.getAll = async (req, res) => {
    try {
        const statuses = await gameStatus.findAll();
        res.status(200).json({ message: 'Game statuses fetched successfully', data: statuses });
    } catch (error) {
        console.error('Error fetching game statuses:', error);
        res.status(500).json({ message: 'Error fetching game statuses', error: error.message });
    }
};
// TODO : vérifié le fonctionnement de la fonction Création et suppression

// Ajouter un statut de jeu
controller.create = async (req, res) => {
    try {
        const { user_id, igdb_game_id, game_status_id } = req.body;

        const newStatus = await gameStatus.create({
            user_id,
            igdb_game_id,
            game_status_id
        });

        res.status(201).json({ message: 'Game status created successfully', data: newStatus });
    } catch (error) {
        console.error('Error creating game status:', error);
        res.status(500).json({ message: 'Error creating game status', error: error.message });
    }
};

// Supprimer un statut de jeu
controller.delete = async (req, res) => {
    try {
        const { user_id, igdb_game_id } = req.params;

        const deletedCount = await gameStatus.destroy({
            where: { user_id, igdb_game_id }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Game status not found' });
        }

        res.status(200).json({ message: 'Game status deleted successfully' });
    } catch (error) {
        console.error('Error deleting game status:', error);
        res.status(500).json({ message: 'Error deleting game status', error: error.message });
    }
};

module.exports = controller;
