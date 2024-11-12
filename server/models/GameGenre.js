module.exports = (sequelize, DataTypes) => {
    return sequelize.define('GameGenre', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}