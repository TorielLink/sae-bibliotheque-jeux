const {gameStatus, status} = require('../database/sequelize'); // Assurez-vous d'importer les bons modèles

const controller = {};

// Récupérer tous les statuts de jeu avec leur statut générique associé
controller.getAllGameStatus = async (req, res) => {
    try {
        const gameStatusData = await gameStatusData.findAll({
            include: {
                model: status,
                as: 'status',
                attributes: ['game_status_id', 'name', 'icon'],
            },
        });
        res.status(200).json({message: 'Game status fetched successfully', data: gameStatusData});
    } catch (error) {
        console.error('Error fetching game status:', error);
        res.status(500).json({message: 'Error fetching game status', error: error.message});
    }
};

// Récupérer les statuts de jeu pour un utilisateur spécifique
controller.getGameStatusByUser = async (req, res) => {
    try {
        const {userId} = req.params; // ID de l'utilisateur
        const userGameStatus = await gameStatus.findAll({
            where: {user_id: userId},
            include: {
                model: status,
                as: 'status',
                attributes: ['game_status_id', 'name', 'icon'],
            },
        });

        if (!userGameStatus || userGameStatus.length === 0) {
            return res.status(404).json({message: 'No game status found for this user'});
        }

        res.status(200).json({message: 'User game status fetched successfully', data: userGameStatus});
    } catch (error) {
        console.error('Error fetching user game status:', error);
        res.status(500).json({message: 'Error fetching user game status', error: error.message});
    }
};

// Récupérer les statuts de jeu pour un jeu spécifique
controller.getGameByGame = async (req, res) => {
    try {
        const {igdb_game_id} = req.params; // ID du jeu (igdb_game_id)
        const gameStatusData = await gameStatus.findAll({
            where: {igdb_game_id: igdb_game_id},
            include: {
                model: status,
                as: 'status',
                attributes: ['game_status_id', 'name', 'icon'],
            },
        });

        if (!gameStatusData || gameStatusData.length === 0) {
            return res.status(404).json({message: 'No game status found for this game'});
        }

        res.status(200).json({message: 'Game status fetched successfully', data: gameStatusData});
    } catch (error) {
        console.error('Error fetching game status by game ID:', error);
        res.status(500).json({message: 'Error fetching game status by game ID', error: error.message});
    }
}

controller.getStatusByUserAndGame = async (req, res) => {
    try {
        const {userId, gameId} = req.params
        const gameStatusData = await gameStatus.findOne({
            where: {
                user_id: userId,
                igdb_game_id: gameId
            }
        });

        if (!gameStatusData) {
            return res.status(404).json({message: 'No game status found for this game and user'});
        }

        res.status(200).json({message: 'Game status fetched successfully', data: gameStatusData});
    } catch (error) {
        console.error('Error fetching game status :', error);
        res.status(500).json({message: 'Error fetching game status', error: error.message});
    }
}

module.exports = controller;
