module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Users', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        mail: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        profile_picture: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        privacySettings: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'PrivacySettings',
                key: 'privacy_setting_id'
            }
        },
    },

        {
        freezeTableName: true,
        timestamps: false,
    }
    )
}