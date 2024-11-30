module.exports = (sequelize, DataTypes) => {
    return sequelize.define('friends', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Clé primaire composite avec user_id_1
            references: {
                model: 'users', // Table `users`
                key: 'user_id'
            }
        },
        user_id_1: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Clé primaire composite avec user_id
            references: {
                model: 'users', // Table `users`
                key: 'user_id'
            }
        }
    }, {
        freezeTableName: true, // Utilise exactement le nom de la table `friends`
        timestamps: false // Pas de colonnes createdAt/updatedAt
    });
};
