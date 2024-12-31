const {gameLogs, users, gamePlatforms, privacySettings} = require('../database/sequelize');

const controller = {};

// **Récupérer tous les journaux de jeux**
controller.getAll = async (req, res) => {
    try {
        const logs = await gameLogs.findAll({
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: ['username', 'mail'],
                },
                {
                    model: gamePlatforms,
                    as: 'platform',
                    attributes: ['name', 'short_name'],
                },
                {
                    model: privacySettings,
                    as: 'privacy',
                    attributes: ['name'],
                }
            ],
            attributes: ['game_log_id', 'igdb_game_id', 'time_played'],
        });
        res.status(200).json({message: 'Game logs fetched successfully', data: logs});
    } catch (error) {
        console.error('Error fetching game logs:', error);
        res.status(500).json({message: 'Error fetching game logs', error: error.message});
    }
};


module.exports = controller;
