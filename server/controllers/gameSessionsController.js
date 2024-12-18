const {gameSession, users, gamePlatforms, privacySettings} = require('../database/sequelize')

const controller = {}

// Récupérer toutes les sessions de jeu
controller.getAll = async (req, res) => {
    try {
        const sessions = await gameSession.findAll()
        res.status(200).json({message: 'Game sessions fetched successfully', data: sessions})
    } catch (error) {
        console.error('Error fetching game sessions:', error)
        res.status(500).json({message: 'Error fetching game sessions', error: error.message})
    }
}

controller.getAllByLog = async (req, res) => {
    try {
        const {logId} = req.params
        const sessions = await gameSession.findAll({
            where: {game_log_id: logId},
            attributes: ['game_session_id', 'session_date', 'title', 'content', 'time_played', 'game_log_id'],
        })
        res.status(200).json({message: 'Game sessions fetched successfully', data: sessions})
    } catch (error) {
        console.error('Error fetching game sessions:', error)
        res.status(500).json({message: 'Error fetching game sessions', error: error.message})
    }
}

module.exports = controller
