const { userLists } = require('../database/sequelize');

const controller = {};

// Récupérer toutes les relations entre utilisateurs et listes
controller.getAll = async (req, res) => {
    try {
        const allUserLists = await userLists.findAll();
        res.status(200).json({ message: 'User lists fetched successfully', data: allUserLists });
    } catch (error) {
        console.error('Error fetching user lists:', error);
        res.status(500).json({ message: 'Error fetching user lists', error: error.message });
    }
};


module.exports = controller;
