module.exports = (sequelize, DataTypes) => {
    return sequelize.define('status', {
        game_status_id: {
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
        freezeTableName: true, // Utilise exactement le nom `status`
        timestamps: false // Pas de colonnes createdAt/updatedAt
    });
};
