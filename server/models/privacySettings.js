module.exports = (sequelize, DataTypes) => {
    return sequelize.define('privacy_settings', {
        privacy_setting_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
            }
        },
        {
        freezeTableName: true,
        timestamps: false,
    }
    )
}