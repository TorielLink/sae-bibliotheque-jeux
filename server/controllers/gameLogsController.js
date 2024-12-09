const { gameLogs, users, gamePlatforms, privacySettings } = require('../database/sequelize');

const controller = {};

// **Récupérer tous les journaux de jeux**
controller.getAll = async (req, res) => {
    try {
        const logs = await gameLogs.findAll({
            include: [
                {
                    model: users,
                    as: 'user', // Alias défini dans les relations Sequelize
                    attributes: ['username', 'mail'], // Champs spécifiques à récupérer
                },
                {
                    model: gamePlatforms,
                    as: 'platform', // Alias défini dans les relations Sequelize
                    attributes: ['name', 'short_name'], // Champs spécifiques à récupérer
                },
                {
                    model: privacySettings,
                    as: 'privacy', // Alias défini dans les relations Sequelize
                    attributes: ['name'], // Champs spécifiques à récupérer
                }
            ],
            attributes: ['game_log_id', 'igdb_game_id', 'time_played'], // Champs spécifiques des journaux
        });
        res.status(200).json({ message: 'Game logs fetched successfully', data: logs });
    } catch (error) {
        console.error('Error fetching game logs:', error);
        res.status(500).json({ message: 'Error fetching game logs', error: error.message });
    }
};


module.exports = controller;
