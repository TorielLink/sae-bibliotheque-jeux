const {Sequelize, DataTypes} = require('sequelize');
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
        logging: console.log,
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
// Définition des relations avec commentaires sur les cardinalités

// Privacy Settings → Users (One-to-Many)
// Chaque paramètre de confidentialité (privacy_settings) peut être lié à plusieurs utilisateurs (users),
// mais chaque utilisateur a exactement un paramètre de confidentialité.
users.belongsTo(privacySettings, {foreignKey: 'privacy_setting_id', as: 'default_privacy'});
privacySettings.hasMany(users, {foreignKey: 'privacy_setting_id'});

// 2. Game Logs → Users (Many-to-One)
// Chaque journal de jeu (game_logs) appartient à un utilisateur unique,
// mais un utilisateur peut avoir plusieurs journaux de jeu.
gameLogs.belongsTo(users, {foreignKey: 'user_id', as: 'user'});
users.hasMany(gameLogs, {foreignKey: 'user_id'});

// Game Logs → Game Platforms (Many-to-One)
// Chaque journal de jeu (game_logs) est associé à une plateforme unique (game_platforms),
// mais une plateforme peut être liée à plusieurs journaux de jeu.
gameLogs.belongsTo(gamePlatforms, {foreignKey: 'platform_id', as: 'platform'});
gamePlatforms.hasMany(gameLogs, {foreignKey: 'platform_id'});

// Game Logs → Privacy Settings (Many-to-One)
// Chaque journal de jeu (game_logs) a un paramètre de confidentialité unique,
// mais un paramètre de confidentialité peut être partagé par plusieurs journaux de jeu.
gameLogs.belongsTo(privacySettings, {foreignKey: 'privacy_setting_id', as: 'privacy'});
privacySettings.hasMany(gameLogs, {foreignKey: 'privacy_setting_id'});

// Users ↔ Friends (Many-to-Many)
// Chaque utilisateur peut avoir plusieurs amis (users), et chaque ami peut être lié à plusieurs utilisateurs.
// La relation est représentée par une table intermédiaire `friends`.
users.belongsToMany(users, {
    through: friends,
    as: 'friendOf', // Alias pour indiquer que l'utilisateur est ami avec quelqu'un
    foreignKey: 'user_id',
    otherKey: 'user_id_1',
});

users.belongsToMany(users, {
    through: friends,
    as: 'friendsWith', // Alias pour indiquer l'inverse (quelqu'un est ami avec cet utilisateur)
    foreignKey: 'user_id_1',
    otherKey: 'user_id',
});

// Relation Game Lists → List Content (One-to-Many)
// Chaque contenu de liste (list_content) appartient à une seule liste (game_lists),
// et chaque liste (game_lists) peut contenir plusieurs contenus (list_content).
listContent.belongsTo(gameList, {foreignKey: 'game_list_id', as: 'list'});
gameList.hasMany(listContent, {foreignKey: 'game_list_id', as: 'contents'});

// Users ↔ Game Lists (Many-to-Many)
// Un utilisateur peut avoir plusieurs listes de jeux (game_lists),
// et une liste de jeux peut être partagée par plusieurs utilisateurs.
// La relation est représentée par une table intermédiaire `user_lists`.

// users ↔ gameLists (Many-to-Many via userLists)
// users ↔ gameLists (Many-to-Many via userLists)
// Pour users ↔ gameList

users.belongsToMany(gameList, {
    through: userLists,
    as: 'game_lists', // Alias utilisé pour accéder aux listes depuis un utilisateur
    foreignKey: 'user_id', // Clé étrangère pointant vers users dans user_lists
    otherKey: 'game_list_id', // Clé étrangère pointant vers game_lists dans user_lists
});

// Pour gameList ↔ users
gameList.belongsToMany(users, {
    through: userLists,
    as: 'users', // Alias utilisé pour accéder aux utilisateurs depuis une liste
    foreignKey: 'game_list_id', // Clé étrangère pointant vers game_lists dans user_lists
    otherKey: 'user_id', // Clé étrangère pointant vers users dans user_lists
});
// Associations entre userLists et users
userLists.belongsTo(users, {foreignKey: 'user_id', as: 'user'});
users.hasMany(userLists, {foreignKey: 'user_id'});

// Associations entre userLists et gameList
userLists.belongsTo(gameList, {foreignKey: 'game_list_id', as: 'game_list'});
gameList.hasMany(userLists, {foreignKey: 'game_list_id'});

// Game Reviews → Privacy Settings (Many-to-One)
// Chaque critique de jeu (game_reviews) a un paramètre de confidentialité unique,
// mais un paramètre de confidentialité peut être partagé par plusieurs critiques.
gameReview.belongsTo(privacySettings, {foreignKey: 'privacy_setting_id', as: 'review_privacy'});
privacySettings.hasMany(gameReview, {foreignKey: 'privacy_setting_id'});

// Game Ratings → Privacy Settings (Many-to-One)
// Chaque évaluation de jeu (game_ratings) a un paramètre de confidentialité unique,
// mais un paramètre de confidentialité peut être partagé par plusieurs évaluations.
gameRatings.belongsTo(privacySettings, {foreignKey: 'privacy_setting_id', as: 'rating_privacy'});
privacySettings.hasMany(gameRatings, {foreignKey: 'privacy_setting_id'});

// Game Status → Users (Many-to-One)
// Chaque statut de jeu (game_status) appartient à un utilisateur unique,
// mais un utilisateur peut avoir plusieurs statuts de jeu.
gameStatus.belongsTo(users, {foreignKey: 'user_id', as: 'user_status'});
users.hasMany(gameStatus, {foreignKey: 'user_id'});

// Game Status → Status (Many-to-One)
// Chaque statut de jeu (game_status) est associé à un statut générique unique (status),
// mais un statut générique peut être partagé par plusieurs statuts de jeu.
gameStatus.belongsTo(status, {foreignKey: 'game_status_id', as: 'status'});
status.hasMany(gameStatus, {foreignKey: 'game_status_id'});

module.exports = {
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
};

