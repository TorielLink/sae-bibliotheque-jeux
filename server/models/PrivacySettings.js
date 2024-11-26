module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PrivacySettings', {
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