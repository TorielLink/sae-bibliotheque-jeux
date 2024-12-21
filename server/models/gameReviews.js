module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_reviews', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true, // Nouvelle clé primaire unique
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id',
            },
            onDelete: 'SET NULL', // Les critiques ne seront pas supprimées, mais user_id sera mis à NULL
        },
        igdb_game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'games', // Supposons qu'il existe une table `games`
                key: 'igdb_game_id',
            },
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true, // Texte optionnel
        },
        spoiler: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, // Par défaut : pas de spoiler
        },
        date_published: {
            type: DataTypes.DATE,
            allowNull: false, // Obligatoire
        },
        privacy_setting_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // Peut être NULL pour gérer les suppressions de privacy settings
            references: {
                model: 'privacy_settings',
                key: 'privacy_setting_id',
            },
            onDelete: 'SET NULL', // Met à NULL si une privacy setting est supprimée
        },
    }, {
        freezeTableName: true, // Empêche la pluralisation automatique du nom de la table
        timestamps: false, // Pas de createdAt/updatedAt
    });
};
