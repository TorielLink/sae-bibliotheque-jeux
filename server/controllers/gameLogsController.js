const {gameLogs, users, gamePlatforms, privacySettings} = require('../database/sequelize');

const controller = {};

// **Récupérer tous les journaux de jeux**
controller.getAll = async (req, res) => {
    try {
        const logs = await gameLogs.findAll({
            include: [
                {
                    model: gamePlatforms,
                    as: 'platform',
                },
                {
                    model: privacySettings,
                    as: 'privacy',
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
        const {userId} = req.params
        const logs = await gameLogs.findAll({
            where: {user_id: userId},
            include: [
                {
                    model: gamePlatforms,
                    as: 'platform',
                },
                {
                    model: privacySettings,
                    as: 'privacy',
                }
            ],
            attributes: ['game_log_id', 'igdb_game_id', 'time_played'],
        })
        if (logs.length === 0) {
            return res.status(404).json({message: 'No game logs found for this user'})
        }
        res.status(200).json({message: 'Game logs fetched successfully', data: logs})
    } catch (error) {
        console.error('Error fetching game logs for user:', error)
        res.status(500).json({message: 'Error fetching game logs for user', error: error.message})
    }
}

controller.getByUserAndGame = async (req, res) => {
    try {
        const {userId, gameId} = req.params
        const logs = await gameLogs.findAll({
            where: {
                user_id: userId,
                igdb_game_id: gameId
            },
        })
        if (logs.length === 0) {
            return res.status(404).json({message: 'No game logs found for this user and game'})
        }
        res.status(200).json({message: 'Game logs fetched successfully', data: logs})
    } catch (error) {
        console.error('Error fetching game logs :', error)
        res.status(500).json({message: 'Error fetching game logs', error: error.message})
    }
}

controller.updateLog = async (req, res) => {
    try {
        const {logId} = req.params
        const {privacy_setting_id, platform_id, time_played} = req.body

        const log = await gameLogs.findByPk(logId);
        if (!log) {
            return res.status(404).json({message: 'Game log not found'})
        }

        await log.update({privacy_setting_id, platform_id, time_played})

        res.status(200).json({message: 'Game log updated successfully', data: log})
    } catch (error) {
        console.error('Error updating game log:', error)
        res.status(500).json({message: 'Error updating game log', error: error.message})
    }
}

controller.deleteLog = async (req, res) => {
    try {
        const {logId} = req.params

        const log = await gameLogs.findByPk(logId)
        console.log(log)
        if (!log) {
            return res.status(404).json({message: 'Log not found'})
        }

        await log.destroy()

        res.status(200).json({message: 'Log deleted successfully'})
    } catch (error) {
        console.error('Error deleting log:', error)
        res.status(500).json({message: 'Error deleting log', error: error.message})
    }
}

controller.createLog = async (req, res) => {
    try {
        const {userId, gameId} = req.params

        if (!userId || !gameId) {
            return res.status(400).json({message: 'Missing required fields: userId and gameId'})
        }

        const newLog = await gameLogs.create({
            user_id: Number(userId),
            igdb_game_id: Number(gameId),
            time_played: 0,
            privacy_setting_id: 1,
            platform_id: 1
        });

        res.status(201).json({message: 'Game log created successfully', data: newLog})
    } catch (error) {
        console.error('Error creating game log:', error)
        res.status(500).json({message: 'Error creating game log', error: error.message})
    }
}


module.exports = controller;