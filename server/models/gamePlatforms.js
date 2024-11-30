module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_platforms', {
        platform_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        icon: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
};
