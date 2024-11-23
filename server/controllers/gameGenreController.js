// gameGenreController.js
const { gameGenre } = require('../database/sequelize');

const controller = {};

// This function retrieves all game genres that are not marked as deleted
controller.getAll = async (req, res) => {
  try {
    const gameGenres = await gameGenre.findAll({
      where: {
        isDeleted: false
      }
    });
    res.status(200).json({ message: 'Game genres fetched successfully', data: gameGenres });
  } catch (error) {
    console.error('Error fetching game genres:', error);
    res.status(500).json({ message: 'Error fetching game genres', error: error.message });
  }
};

module.exports = controller;
