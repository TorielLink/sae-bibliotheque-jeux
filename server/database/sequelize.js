const {Sequelize, DataTypes} = require('sequelize');
require('dotenv').config();

// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: console.log,
    }
);

// Initialize models
const usersModel = require('../models/users.js');
const privacySettingsModel = require('../models/privacySettings.js');
const statusModel = require('../models/status.js');
const gamePlatformsModel = require('../models/gamePlatforms.js');
const gameCollectionsModel = require('../models/gameCollection.js');
const collectionContentModel = require('../models/collectionContent.js');
const gameLogsModel = require('../models/gameLogs.js');
const gameSessionModel = require('../models/gameSessions.js');
const gameReviewModel = require('../models/gameReviews.js');
const gameRatingsModel = require('../models/gameRatings.js');
const gameStatusModel = require('../models/gameStatus.js');
const friendsModel = require('../models/friends.js');

// Define models
const user = usersModel(sequelize, DataTypes);
const privacySettings = privacySettingsModel(sequelize, DataTypes);
const status = statusModel(sequelize, DataTypes);
const gamePlatforms = gamePlatformsModel(sequelize, DataTypes);
const gameCollection = gameCollectionsModel(sequelize, DataTypes);
const collectionContent = collectionContentModel(sequelize, DataTypes);
const gameLogs = gameLogsModel(sequelize, DataTypes);
const gameSession = gameSessionModel(sequelize, DataTypes);
const gameReview = gameReviewModel(sequelize, DataTypes);
const gameRatings = gameRatingsModel(sequelize, DataTypes);
const gameStatus = gameStatusModel(sequelize, DataTypes);
const friends = friendsModel(sequelize, DataTypes);


// sequelize.sync({force: false}) // Si vous ne voulez pas supprimer les données existantes, mettez force: false
//     .then(() => {
//         console.log('La base de données a été synchronisée avec succès.');
//     })
//     .catch((error) => {
//         console.error('Erreur lors de la synchronisation de la base de données :', error);
//     });

// Associations
const associateModels = () => {
    // Privacy Settings → Users (One-to-Many)
    user.belongsTo(privacySettings, {foreignKey: 'privacy_setting_id', as: 'default_privacy'});
    privacySettings.hasMany(user, {foreignKey: 'privacy_setting_id', as: 'users'});

    // Game Reviews → Users (Many-to-One)
    gameReview.belongsTo(user, {foreignKey: 'user_id', as: 'user'});
    user.hasMany(gameReview, {foreignKey: 'user_id', as: 'game_reviews'});

    // Game Reviews → Privacy Settings (Many-to-One)
    gameReview.belongsTo(privacySettings, {foreignKey: 'privacy_setting_id', as: 'review_privacy'});
    privacySettings.hasMany(gameReview, {foreignKey: 'privacy_setting_id', as: 'reviews'});

    // Game Logs → Users (Many-to-One)
    gameLogs.belongsTo(user, {foreignKey: 'user_id', as: 'user'});
    user.hasMany(gameLogs, {foreignKey: 'user_id', as: 'user_game_logs'});

    // Game Logs → Game Platforms (Many-to-One)
    gameLogs.belongsTo(gamePlatforms, {foreignKey: 'platform_id', as: 'platform'});
    gamePlatforms.hasMany(gameLogs, {foreignKey: 'platform_id', as: 'platform_game_logs'});

    // Game Logs → Privacy Settings (Many-to-One)
    gameLogs.belongsTo(privacySettings, {foreignKey: 'privacy_setting_id', as: 'privacy'});
    privacySettings.hasMany(gameLogs, {foreignKey: 'privacy_setting_id', as: 'privacy_game_logs'}); // Changement d'alias

    // Game Sessions → Game Logs (Many-to-One)
    gameLogs.hasMany(gameSession, {foreignKey: 'game_log_id', as: 'game_sessions'});
    gameSession.belongsTo(gameLogs, {foreignKey: 'game_log_id', as: 'game_log'});

    // Game Reviews → Game Logs (One-to-Many)
    gameReview.hasMany(gameLogs, {foreignKey: 'igdb_game_id', as: 'game_logs'});
    gameLogs.belongsTo(gameReview, {foreignKey: 'igdb_game_id', as: 'game_review'});

    // Users ↔ Friends (Many-to-Many)
    user.belongsToMany(user, {
        through: friends,
        as: 'friendOf',
        foreignKey: 'user_id',
        otherKey: 'user_id_1',
    });
    user.belongsToMany(user, {
        through: friends,
        as: 'friendsWith',
        foreignKey: 'user_id_1',
        otherKey: 'user_id',
    });


    // Collections
    user.hasMany(gameCollection, {foreignKey: 'user_id', as: 'game_collections'})
    gameCollection.belongsTo(user, {foreignKey: 'user_id', as: 'users'})
    gameCollection.hasMany(collectionContent, {
        foreignKey: 'game_collection_id',
        as: 'collection_content',
        onDelete: 'CASCADE'
    })
    collectionContent.belongsTo(gameCollection, {foreignKey: 'game_collection_id', as: 'game_collection'})

    gameCollection.belongsTo(privacySettings, {foreignKey: 'privacy_setting_id', as: 'privacy'})
    privacySettings.hasMany(gameCollection, {foreignKey: 'privacy_setting_id', as: 'privacy_game_collection'})

    // Game Ratings → Users (Many-to-One)
    gameRatings.belongsTo(user, {foreignKey: 'user_id', as: 'user'});
    user.hasMany(gameRatings, {foreignKey: 'user_id', as: 'user_ratings'});

    // Game Ratings → Privacy Settings (Many-to-One)
    gameRatings.belongsTo(privacySettings, {foreignKey: 'privacy_setting_id', as: 'rating_privacy'});
    privacySettings.hasMany(gameRatings, {foreignKey: 'privacy_setting_id', as: 'game_ratings'});

    // Game Status → Users (Many-to-One)
    gameStatus.belongsTo(user, {foreignKey: 'user_id', as: 'user_status'});
    user.hasMany(gameStatus, {foreignKey: 'user_id', as: 'game_statuses'});

    // Game Status → Status (Many-to-One)
    gameStatus.belongsTo(status, {foreignKey: 'game_status_id', as: 'status'});
    status.hasMany(gameStatus, {foreignKey: 'game_status_id', as: 'game_statuses'});

    // game_status → game_logs (via igdb_game_id)
    gameStatus.hasMany(gameLogs, {foreignKey: 'igdb_game_id', sourceKey: 'igdb_game_id', as: 'status_game_logs'});
    gameLogs.belongsTo(gameStatus, {foreignKey: 'igdb_game_id', targetKey: 'igdb_game_id', as: 'status'});

    gameStatus.hasMany(gameRatings, {foreignKey: 'igdb_game_id', sourceKey: 'igdb_game_id', as: 'ratings'});
    gameRatings.belongsTo(gameStatus, {foreignKey: 'igdb_game_id', targetKey: 'igdb_game_id', as: 'game_status'});

};

// Initialize associations
associateModels();

module.exports = {
    sequelize,
    users: user,
    privacySettings,
    status,
    gamePlatforms,
    gameCollection,
    collectionContent,
    gameLogs,
    gameSession,
    gameReview,
    gameRatings,
    gameStatus,
    friends,
    Sequelize,
};
