const { friends } = require('../database/sequelize');

const controller = {};

// Récupérer tous les amis
controller.getAll = async (req, res) => {
    try {
        const allFriends = await friends.findAll();
        res.status(200).json({ message: 'Friends fetched successfully', data: allFriends });
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Error fetching friends', error: error.message });
    }
};


module.exports = controller;
