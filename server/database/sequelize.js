const { Sequelize, DataTypes } = require('sequelize');
const usersModel = require('../models/users.js');
const privacySettingsModel = require('../models/privacySettings.js');
const statusModel = require('../models/status.js');
const gamePlatformsModel = require('../models/gamePlatforms.js');
const gameListModel = require('../models/gameLists.js');
const listContentModel = require('../models/listContent.js');
const gameLogsModel = require('../models/gameLogs.js');
const gameSessionModel = require('../models/gameSessions.js');
const gameReviewModel = require('../models/gameReviews.js');
const gameRatingsModel = require('../models/gameRatings.js');
const gameStatusModel = require('../models/gameStatus.js');
const friendsModel = require('../models/friends.js');
const userListsModel = require('../models/userLists.js');
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
const users = usersModel(sequelize, DataTypes);
const privacySettings = privacySettingsModel(sequelize, DataTypes);
const status = statusModel(sequelize, DataTypes);
const gamePlatforms = gamePlatformsModel(sequelize, DataTypes);
const gameList = gameListModel(sequelize, DataTypes);
const listContent = listContentModel(sequelize, DataTypes);
const gameLogs = gameLogsModel(sequelize, DataTypes);
const gameSession = gameSessionModel(sequelize, DataTypes);
const gameReview = gameReviewModel(sequelize, DataTypes);
const gameRatings = gameRatingsModel(sequelize, DataTypes);
const gameStatus = gameStatusModel(sequelize, DataTypes);
const friends = friendsModel(sequelize, DataTypes);
const userLists = userListsModel(sequelize, DataTypes);

module.exports = {
    users,  // Export the initialized model
    privacySettings,  // Export the initialized model
    status,  // Export the initialized model
    gamePlatforms,  // Export the initialized model
    gameList,  // Export the initialized model
    listContent,  // Export the initialized model
    gameLogs,  // Export the initialized model
    gameSession,  // Export the initialized model
    gameReview,  // Export the initialized model
    gameRatings,  // Export the initialized model
    gameStatus,  // Export the initialized model
    friends,  // Export the initialized model
    userLists,  // Export the initialized model
};
