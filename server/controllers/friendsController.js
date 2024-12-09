const { friends, users } = require('../database/sequelize');

const controller = {};

// Récupérer tous les amis (table friends)
controller.getAllFriends = async (req, res) => {
    try {
        const friendsData = await friends.findAll(); // Récupère toutes les relations d'amitié
        res.status(200).json({ message: 'Friends data fetched successfully', data: friendsData });
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Error fetching friends', error: error.message });
    }
};

controller.getFriendsByUserId = async (req, res) => {
    try {
        const { id } = req.params; // ID de l'utilisateur
        const userWithFriends = await users.findOne({
            where: { user_id: id },
            include: [
                {
                    model: users,
                    as: 'friendOf', // Utiliser l'alias défini dans l'association
                    attributes: ['user_id', 'username', 'mail'], // Champs spécifiques des amis
                },
                {
                    model: users,
                    as: 'friendsWith', // Utiliser l'alias inverse
                    attributes: ['user_id', 'username', 'mail'], // Champs spécifiques des amis
                },
            ],
        });

        if (!userWithFriends) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Friends fetched successfully', data: userWithFriends });
    } catch (error) {
        console.error('Error fetching friends by user ID:', error);
        res.status(500).json({ message: 'Error fetching friends by user ID', error: error.message });
    }
};


module.exports = controller;
