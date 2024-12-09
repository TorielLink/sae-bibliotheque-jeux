const { listContent, gameList } = require('../database/sequelize');

const controller = {};

// Récupérer tous les contenus de listes
controller.getAllContents = async (req, res) => {
    try {
        const allContents = await listContent.findAll({
            include: {
                model: gameList,
                as: 'list', // Alias défini dans Sequelize
                attributes: ['game_list_id', 'name', 'description'], // Champs spécifiques des listes
            },
        });

        res.status(200).json({ message: 'Contents fetched successfully', data: allContents });
    } catch (error) {
        console.error('Error fetching contents:', error);
        res.status(500).json({ message: 'Error fetching contents', error: error.message });
    }
};

// Récupérer les contenus d’une liste spécifique
controller.getContentsByListId = async (req, res) => {
    try {
        const { id } = req.params; // ID de la liste
        const listWithContents = await gameList.findOne({
            where: { game_list_id: id },
            include: {
                model: listContent,
                as: 'contents', // Alias défini dans Sequelize
                attributes: ['igdb_game_id'], // Champs spécifiques des contenus
            },
            attributes: ['game_list_id', 'name', 'description'], // Champs spécifiques de la liste
        });

        if (!listWithContents) {
            return res.status(404).json({ message: 'Game list not found' });
        }

        res.status(200).json({ message: 'Contents fetched successfully', data: listWithContents });
    } catch (error) {
        console.error('Error fetching contents by list ID:', error);
        res.status(500).json({ message: 'Error fetching contents by list ID', error: error.message });
    }
};

module.exports = controller;
