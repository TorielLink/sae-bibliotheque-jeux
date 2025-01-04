const {gameStatus, status, gameLogs} = require('../database/sequelize'); // Assurez-vous d'importer les bons modèles

const controller = {};

// Récupérer tous les statuts de jeu avec leur statut générique associé
controller.getAllGameStatuses = async (req, res) => {
    try {
        const gameStatuses = await gameStatus.findAll({
            include: {
                model: status,
                as: 'status',
                attributes: ['game_status_id', 'name', 'icon'],
            },
        });
        res.status(200).json({message: 'Game statuses fetched successfully', data: gameStatuses});
    } catch (error) {
        console.error('Error fetching game statuses:', error);
        res.status(500).json({message: 'Error fetching game statuses', error: error.message});
    }
};

// Récupérer les statuts de jeu pour un utilisateur spécifique
controller.getGameStatusesByUser = async (req, res) => {
    try {
        const {userId} = req.params; // ID de l'utilisateur
        const userGameStatuses = await gameStatus.findAll({
            where: {user_id: userId},
            include: {
                model: status,
                as: 'status',
                attributes: ['game_status_id', 'name', 'icon'],
            },
        });

        if (!userGameStatuses || userGameStatuses.length === 0) {
            return res.status(404).json({message: 'No game statuses found for this user'});
        }

        res.status(200).json({message: 'User game statuses fetched successfully', data: userGameStatuses});
    } catch (error) {
        console.error('Error fetching user game statuses:', error);
        res.status(500).json({message: 'Error fetching user game statuses', error: error.message});
    }
};

// Récupérer les statuts de jeu pour un jeu spécifique
controller.getGameStatusesByGame = async (req, res) => {
    try {
        const {igdb_game_id} = req.params; // ID du jeu (igdb_game_id)
        const gameStatuses = await gameStatus.findAll({
            where: {igdb_game_id: igdb_game_id},
            include: {
                model: status,
                as: 'status',
                attributes: ['game_status_id', 'name', 'icon'],
            },
        });

        if (!gameStatuses || gameStatuses.length === 0) {
            return res.status(404).json({message: 'No game statuses found for this game'});
        }

        res.status(200).json({message: 'Game statuses fetched successfully', data: gameStatuses});
    } catch (error) {
        console.error('Error fetching game statuses by game ID:', error);
        res.status(500).json({message: 'Error fetching game statuses by game ID', error: error.message});
    }
}

controller.getStatusByUserAndGame = async (req, res) => {
    try {
        const {userId, gameId} = req.params
        let gameStatusData = await gameStatus.findOne({
            where: {
                user_id: userId,
                igdb_game_id: gameId
            }
        });

        if (!gameStatusData) {
            gameStatusData = null
        }

        res.status(200).json({message: 'Game status fetched successfully', data: gameStatusData});
    } catch (error) {
        console.error('Error fetching game status :', error);
        res.status(500).json({message: 'Error fetching game status', error: error.message});
    }
}

controller.updateGameStatus = async (req, res) => {
    try {
        const {userId, gameId} = req.params
        const {game_status_id} = req.body

        if (!game_status_id) {
            return res.status(400).json({message: 'game_status_id is required'})
        }

        let game_status = await gameStatus.findOne({
            where: {
                user_id: userId,
                igdb_game_id: gameId,
            },
        })

        if (!game_status) {
            game_status = await gameStatus.create({
                user_id: Number(userId),
                igdb_game_id: Number(gameId),
                game_status_id: game_status_id,
            })

            return res.status(201).json({
                message: 'Game status created successfully',
                data: game_status,
            })
        }

        game_status.game_status_id = game_status_id

        await game_status.save()

        res.status(200).json({message: 'Game status updated successfully', data: game_status})
    } catch (error) {
        console.error('Error updating game status:', error)
        res.status(500).json({message: 'Error updating game status', error: error.message})
    }
}

module.exports = controller;
