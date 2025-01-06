const {userLists, users, gameList} = require('../database/sequelize');

const controller = {};

controller.getAllAssociations = async (req, res) => {
    try {
        const associations = await userLists.findAll({
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: ['user_id', 'username', 'mail'],
                },
                {
                    model: gameList,
                    as: 'game_list',
                    attributes: ['game_list_id', 'name', 'description'],
                },
            ],
        });
        console.log('Associations:', associations);

        res.status(200).json({message: 'Associations fetched successfully', data: associations});
    } catch (error) {
        console.error('Error fetching associations:', error);
        res.status(500).json({message: 'Error fetching associations', error: error.message});
    }
};

controller.getUserLists = async (req, res) => {
    try {
        const {id} = req.params;
        const userWithLists = await users.findOne({
            where: {user_id: id},
            include: [{
                model: gameList,
                as: 'game_lists',
                attributes: ['game_list_id', 'name', 'description'],
                through: {attributes: []},
            }],
            attributes: ['user_id', 'username', 'mail'],
        });

        if (!userWithLists) return res.status(404).json({message: 'User not found'});

        res.status(200).json({message: 'User lists fetched successfully', data: userWithLists});
    } catch (error) {
        console.error('Error fetching user lists:', error);
        res.status(500).json({message: 'Error fetching user lists', error: error.message});
    }
};

controller.getListUsers = async (req, res) => {
    try {
        const {id} = req.params;
        const listWithUsers = await gameList.findOne({
            where: {game_list_id: id},
            include: [{
                model: users,
                as: 'users',
                attributes: ['user_id', 'username', 'mail'],
                through: {attributes: []},
            }],
            attributes: ['game_list_id', 'name', 'description'],
        });

        if (!listWithUsers) return res.status(404).json({message: 'Game list not found'});

        res.status(200).json({message: 'List users fetched successfully', data: listWithUsers});
    } catch (error) {
        console.error('Error fetching list users:', error);
        res.status(500).json({message: 'Error fetching list users', error: error.message});
    }
};


module.exports = controller;
