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
            onDelete: 'SET NULL',
        },
        igdb_game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true, // Texte optionnel
        },
        spoiler: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        date_published: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        privacy_setting_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'privacy_settings',
                key: 'privacy_setting_id',
            },
            onDelete: 'SET NULL',
        },
    }, {
        freezeTableName: true, // Empêche la pluralisation automatique du nom de la table
        timestamps: false, // Pas de createdAt/updatedAt
    });
};
