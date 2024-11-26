const { users } = require('../database/sequelize');

const { Op } = require("sequelize");
const controller = {};

controller.getAll = async (req, res) => {
    try {
        const usersData = await users.findAll({
        where: {
            isDeleted: false
        }
        });
        res.status(200).json({ message: 'User data fetched successfully', data: usersData });
    } catch (error) {
        console.error('Error fetching users :', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

module.exports = controller;