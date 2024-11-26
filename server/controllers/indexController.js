const gameGenreController = require("./gameGenreController");
const usersController = require("./usersController");

var controllers = {};

controllers.gameGenre = gameGenreController;
controllers.users = usersController;

module.exports = controllers;