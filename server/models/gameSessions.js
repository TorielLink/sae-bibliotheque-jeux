module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_sessions', {
        game_session_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        session_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        time_played: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        game_log_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'game_logs',
                key: 'game_log_id'
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
};
