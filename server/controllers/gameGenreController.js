const { Op } = require("sequelize");
const { gameGenre } = require('../database/sequelize');
const controller = {};


controller.getAll = async function (req, res) {
    try {
        const gameGenreData = await gameGenre.findAll(
            {
                where: {
                    isDeleted: false
                }
            }
        );
        res.status(200).json({ message: "Connection successful", data: gameGenreData });
    } catch (error) {
        res.status(404).json({ message: "Hum, something goes wrong ...", error: error, data: [] });
    }
};


module.exports = controller;