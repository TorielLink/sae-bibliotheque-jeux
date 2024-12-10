module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_reviews', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'user_id',
                onDelete: 'CASCADE' // Si un utilisateur est supprimé, ses critiques sont supprimées
            }
        },
        igdb_game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true // Clé primaire composite avec user_id
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true // Critiques longues autorisées
        },
        spoiler: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false // Valeur par défaut : pas de spoiler
        },
        date_published: {
            type: DataTypes.DATE,
            allowNull: false // Date obligatoire
        },
        privacy_setting_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'privacy_settings',
                key: 'privacy_setting_id' // Pas de suppression en cascade
            }
        }
    }, {
        freezeTableName: true, // Le nom de la table ne sera pas pluralisé automatiquement
        timestamps: false // Pas de createdAt/updatedAt
    });
};
