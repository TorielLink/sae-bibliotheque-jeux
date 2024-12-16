const {gameLogs, users, gamePlatforms, privacySettings} = require('../database/sequelize');

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
        res.status(200).json({message: 'Game logs fetched successfully', data: logs});
    } catch (error) {
        console.error('Error fetching game logs:', error);
        res.status(500).json({message: 'Error fetching game logs', error: error.message});
    }
}

controller.getByUserId = async (req, res) => {
    try {
        const { userId } = req.params
        const logs = await gameLogs.findAll({
            where: { user_id: userId },
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
        })
        if (logs.length === 0) {
            return res.status(404).json({ message: 'No game logs found for this user' })
        }
        res.status(200).json({ message: 'Game logs fetched successfully', data: logs })
    } catch (error) {
        console.error('Error fetching game logs for user:', error)
        res.status(500).json({ message: 'Error fetching game logs for user', error: error.message })
    }
}

controller.getByUserAndGame = async (req, res) => {
    try {
        const { userId, gameId } = req.params
        const logs = await gameLogs.findAll({
            where: {
                user_id: userId,
                igdb_game_id: gameId
            },
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
        })
        if (logs.length === 0) {
            return res.status(404).json({ message: 'No game logs found for this user and game' })
        }
        res.status(200).json({ message: 'Game logs fetched successfully', data: logs })
    } catch (error) {
        console.error('Error fetching game logs :', error)
        res.status(500).json({ message: 'Error fetching game logs', error: error.message })
    }
}

module.exports = controller;
