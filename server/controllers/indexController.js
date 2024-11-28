const gameGenreController = require("./gameGenreController");
const usersController = require("./usersController");

// Organisation des contrôleurs
const controllers = {
    gameGenre: gameGenreController,
    users: usersController,
};

module.exports = controllers;
