module.exports = (sequelize, DataTypes) => {
    return sequelize.define('list_content', {
        game_list_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Partie de la clé primaire composite
            references: {
                model: 'game_list',
                key: 'game_list_id'
            }
        },
        igdb_game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true // Partie de la clé primaire composite
        }
    }, {
        freezeTableName: true,
        timestamps: false // Désactivation des champs createdAt/updatedAt
    });
};
