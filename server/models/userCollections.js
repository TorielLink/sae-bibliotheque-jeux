module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_collections', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'user_id',
            },
        },
        game_collection_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'game_collections',
                key: 'game_collection_id',
            },
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    });
};
