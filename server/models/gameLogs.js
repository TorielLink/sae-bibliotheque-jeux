module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_logs', {
        game_log_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        igdb_game_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        time_played: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        privacy_setting_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'privacy_settings',
                key: 'privacy_setting_id'
            }
        },
        platform_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'game_platforms',
                key: 'platform_id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
};
