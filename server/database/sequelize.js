const { Sequelize, DataTypes } = require('sequelize');
const gameGenreModel = require('../models/gameGenre.js');
const usersModel = require('../models/users.js');
require('dotenv').config();

let sequelize;

sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: { // Updated from 'looping' to 'pool'
      max: 5, // Maximum number of connections
      min: 0, // Minimum number of connections
      acquire: 30000, // Maximum time in ms before a connection is considered failed
      idle: 10000, // Maximum time a connection can be idle before being released
    },
    logging: console.log, // To view the queries in the console (optional)
  }
);

// Initialize the GameGenre model
const gameGenre = gameGenreModel(sequelize, DataTypes);
const users = usersModel(sequelize, DataTypes);

module.exports = {
  gameGenre,  // Export the initialized model
    users,  // Export the initialized model
};
