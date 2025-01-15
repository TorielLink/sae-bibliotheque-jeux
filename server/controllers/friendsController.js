const {friends, users} = require('../database/sequelize');

const controller = {};

// Récupérer tous les amis (table friends)
controller.getAllFriends = async (req, res) => {
    try {
        const friendsData = await friends.findAll();
        res.status(200).json({message: 'Friends data fetched successfully', data: friendsData});
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({message: 'Error fetching friends', error: error.message});
    }
};

controller.getFriendsByUserId = async (req, res) => {
    try {
        const {id} = req.params;
        const userWithFriends = await users.findOne({
            where: {user_id: id},
            include: [
                {
                    model: users,
                    as: 'friendOf',
                    attributes: ['user_id', 'username', 'mail'],
                },
                {
                    model: users,
                    as: 'friendsWith',
                    attributes: ['user_id', 'username', 'mail'],
                },
            ],
        });

        if (!userWithFriends) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'Friends fetched successfully', data: userWithFriends});
    } catch (error) {
        console.error('Error fetching friends by user ID:', error);
        res.status(500).json({message: 'Error fetching friends by user ID', error: error.message});
    }
};


module.exports = controller;
