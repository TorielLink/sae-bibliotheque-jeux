module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_lists', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Clé primaire composite avec game_list_id
            references: {
                model: 'users', // Table `users`
                key: 'user_id'
            }
        },
        game_list_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Clé primaire composite avec user_id
            references: {
                model: 'game_lists', // Table `game_lists`
                key: 'game_list_id'
            }
        }
    }, {
        freezeTableName: true, // Utilise exactement le nom de la table `user_lists`
        timestamps: false // Pas de colonnes createdAt/updatedAt
    });
};
