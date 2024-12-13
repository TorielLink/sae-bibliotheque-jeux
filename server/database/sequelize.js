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

let sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: 5, // Maximum de connexions
      min: 0,
      acquire: 30000, // Temps max en ms avant d'être considéré comme échoué
      idle: 10000, // Temps max d'inactivité avant de libérer la connexion
    },
    logging: console.log,
  }
);

// Initialisation des modèles
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

// Définition des associations

// Privacy Settings → Users (One-to-Many)
users.belongsTo(privacySettings, { foreignKey: 'privacy_setting_id', as: 'default_privacy' });
privacySettings.hasMany(users, { foreignKey: 'privacy_setting_id' });

// Game Reviews → Users (Many-to-One)
gameReview.belongsTo(users, { foreignKey: 'user_id', as: 'user' });
users.hasMany(gameReview, { foreignKey: 'user_id' });

// Game Reviews → Privacy Settings (Many-to-One)
gameReview.belongsTo(privacySettings, { foreignKey: 'privacy_setting_id', as: 'review_privacy' });
privacySettings.hasMany(gameReview, { foreignKey: 'privacy_setting_id' });

// Association entre gameReview et gameRatings
// L'association est définie sur user_id, et nous utiliserons un where dans les requêtes pour relier igdb_game_id.
// constraints: false permet d'éviter les conflits de clés étrangères non standard
gameReview.belongsTo(gameRatings, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'rating',
  constraints: false,
});

// Game Logs → Users (Many-to-One)
gameLogs.belongsTo(users, { foreignKey: 'user_id', as: 'user' });
users.hasMany(gameLogs, { foreignKey: 'user_id' });

// Game Logs → Game Platforms (Many-to-One)
gameLogs.belongsTo(gamePlatforms, { foreignKey: 'platform_id', as: 'platform' });
gamePlatforms.hasMany(gameLogs, { foreignKey: 'platform_id' });

// Game Logs → Privacy Settings (Many-to-One)
gameLogs.belongsTo(privacySettings, { foreignKey: 'privacy_setting_id', as: 'privacy' });
privacySettings.hasMany(gameLogs, { foreignKey: 'privacy_setting_id' });

// Users ↔ Friends (Many-to-Many)
users.belongsToMany(users, {
  through: friends,
  as: 'friendOf',
  foreignKey: 'user_id',
  otherKey: 'user_id_1',
});
users.belongsToMany(users, {
  through: friends,
  as: 'friendsWith',
  foreignKey: 'user_id_1',
  otherKey: 'user_id',
});

// Game Lists → List Content (One-to-Many)
listContent.belongsTo(gameList, { foreignKey: 'game_list_id', as: 'list' });
gameList.hasMany(listContent, { foreignKey: 'game_list_id', as: 'contents' });

// Users ↔ Game Lists (Many-to-Many)
users.belongsToMany(gameList, {
  through: userLists,
  as: 'game_lists',
  foreignKey: 'user_id',
  otherKey: 'game_list_id',
});
gameList.belongsToMany(users, {
  through: userLists,
  as: 'users',
  foreignKey: 'game_list_id',
  otherKey: 'user_id',
});

// Associations entre userLists et users
userLists.belongsTo(users, { foreignKey: 'user_id', as: 'user' });
users.hasMany(userLists, { foreignKey: 'user_id' });

// Associations entre userLists et gameList
userLists.belongsTo(gameList, { foreignKey: 'game_list_id', as: 'game_list' });
gameList.hasMany(userLists, { foreignKey: 'game_list_id' });

// Game Ratings → Privacy Settings (Many-to-One)
gameRatings.belongsTo(privacySettings, { foreignKey: 'privacy_setting_id', as: 'rating_privacy' });
privacySettings.hasMany(gameRatings, { foreignKey: 'privacy_setting_id' });

// Game Status → Users (Many-to-One)
gameStatus.belongsTo(users, { foreignKey: 'user_id', as: 'user_status' });
users.hasMany(gameStatus, { foreignKey: 'user_id' });

// Game Status → Status (Many-to-One)
gameStatus.belongsTo(status, { foreignKey: 'game_status_id', as: 'status' });
status.hasMany(gameStatus, { foreignKey: 'game_status_id' });

module.exports = {
  sequelize,
  users,
  privacySettings,
  status,
  gamePlatforms,
  gameList,
  listContent,
  gameLogs,
  gameSession,
  gameReview,
  gameRatings,
  gameStatus,
  friends,
  userLists,
  Sequelize,
};
