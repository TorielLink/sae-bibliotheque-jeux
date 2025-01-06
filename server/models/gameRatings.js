module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_ratings', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Clé primaire composite avec igdb_game_id
            references: {
                model: 'users', // Table `users`
                key: 'user_id'
            }
        },
        igdb_game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true // Clé primaire composite avec user_id
        },
        rating_value: {
            type: DataTypes.INTEGER,
            allowNull: false // Valeur d'évaluation
        },
        privacy_setting_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'privacy_settings', // Table `privacy_settings`
                key: 'privacy_setting_id'
            }
        }
    }, {
        freezeTableName: true, // Utilise le nom exact de la table `game_ratings`
        timestamps: false // Pas de colonnes createdAt/updatedAt
    });
};
