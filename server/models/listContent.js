module.exports = (sequelize, DataTypes) => {
    return sequelize.define('list_content', {
        game_list_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'game_list',
                key: 'game_list_id'
            }
        },
        igdb_game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
};
