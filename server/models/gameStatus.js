module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_status', {
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
        game_status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'status', // Table `status`
                key: 'game_status_id'
            }
        }
    }, {
        freezeTableName: true, // Utilise le nom exact de la table `game_status`
        timestamps: false // Pas de colonnes createdAt/updatedAt
    });
};
