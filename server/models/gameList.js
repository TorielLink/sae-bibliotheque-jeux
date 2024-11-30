module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_list', {
        game_list_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
};
