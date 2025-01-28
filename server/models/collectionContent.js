module.exports = (sequelize, DataTypes) => {
    return sequelize.define('collection_content', {
        game_collection_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
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
