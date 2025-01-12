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
            order: [
                ['session_date', 'DESC']
            ],
            attributes: ['game_session_id', 'session_date', 'title', 'content', 'time_played', 'game_log_id'],
        })
        res.status(200).json({message: 'Game sessions fetched successfully', data: sessions})
    } catch (error) {
        console.error('Error fetching game sessions:', error)
        res.status(500).json({message: 'Error fetching game sessions', error: error.message})
    }
}

controller.getAllByLogs = async (req, res) => {
    try {
        const {logIds} = req.body

        if (!Array.isArray(logIds) || logIds.length === 0) {
            return res.status(400).json({
                message: 'logIds must be a non-empty array of game_log_id',
            })
        }

        const sessions = await gameSession.findAll({
            where: {
                game_log_id: logIds,
            },
            order: [['session_date', 'DESC']]
        })

        res.status(200).json({
            message: 'Game sessions fetched successfully',
            data: sessions,
        })
    } catch (error) {
        console.error('Error fetching game sessions:', error)
        res.status(500).json({
            message: 'Error fetching game sessions',
            error: error.message,
        })
    }
}

controller.updateSession = async (req, res) => {
    try {
        const {sessionId} = req.params
        const {title, content, time_played} = req.body

        if (!title || typeof time_played !== 'number') {
            return res.status(400).json({
                message: 'Title, content, and time_played are required',
            })
        }

        const updatedSession = await gameSession.update(
            {title, content, time_played},
            {
                where: {game_session_id: sessionId},
                returning: true,
                plain: true,
            }
        )

        if (!updatedSession[1]) {
            return res.status(404).json({
                message: 'Session not found',
            })
        }

        res.status(200).json({
            message: 'Game session updated successfully',
            data: updatedSession[1],
        })
    } catch (error) {
        console.error('Error updating game session:', error)
        res.status(500).json({
            message: 'Error updating game session',
            error: error.message,
        })
    }
}

controller.createSession = async (req, res) => {
    try {
        const {logId} = req.params

        const date = new Date()
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const newSessionData = {
            title: `Session du ${day}/${month}/${year}`,
            content: '',
            time_played: 0,
            session_date: date,
        }

        const newSession = await gameSession.create({
            ...newSessionData,
            game_log_id: logId,
        })

        res.status(201).json({
            message: 'Game session created successfully',
            data: newSession,
        })

    } catch (error) {
        console.error('Error creating game session:', error)
        res.status(500).json({
            message: 'Error creating game session',
            error: error.message,
        })
    }
}

controller.deleteSession = async (req, res) => {
    try {
        const {sessionId} = req.params

        const session = await gameSession.findByPk(sessionId)

        if (!session) {
            return res.status(404).json({message: 'Session not found'})
        }

        await session.destroy()

        res.status(200).json({
            message: 'Game session deleted successfully',
        })

    } catch (error) {
        console.error('Error deleting game session:', error)
        res.status(500).json({
            message: 'Error deleting game session',
            error: error.message,
        })
    }
}

module.exports = controller
