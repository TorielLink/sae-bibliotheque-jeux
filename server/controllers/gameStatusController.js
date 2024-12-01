const { gameStatus, users } = require('../database/sequelize');

const controller = {};

// Récupérer tous les statuts de jeu avec les informations des utilisateurs
controller.getAllStatuses = async (req, res) => {
    try {
        const statuses = await gameStatus.findAll({
            include: {
                model: users,
                as: 'user_status', // Alias défini dans Sequelize
                attributes: ['user_id', 'username', 'mail'], // Champs spécifiques pour `users`
            },
        });

        res.status(200).json({ message: 'Statuses fetched successfully', data: statuses });
    } catch (error) {
        console.error('Error fetching statuses:', error);
        res.status(500).json({ message: 'Error fetching statuses', error: error.message });
    }
};

// Récupérer tous les statuts de jeu pour un utilisateur spécifique
controller.getStatusesByUserId = async (req, res) => {
    try {
        const { id } = req.params; // ID de l'utilisateur
        const statuses = await gameStatus.findAll({
            where: { user_id: id },
            include: {
                model: users,
                as: 'user_status', // Alias défini dans Sequelize
                attributes: ['user_id', 'username', 'mail'], // Champs spécifiques pour `users`
            },
        });

        if (!statuses || statuses.length === 0) {
            return res.status(404).json({ message: 'No statuses found for this user' });
        }

        res.status(200).json({ message: 'User statuses fetched successfully', data: statuses });
    } catch (error) {
        console.error('Error fetching statuses by user ID:', error);
        res.status(500).json({ message: 'Error fetching statuses by user ID', error: error.message });
    }
};

module.exports = controller;
