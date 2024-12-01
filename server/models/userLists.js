module.exports = (sequelize, DataTypes) => {
  const userLists = sequelize.define('user_lists', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Ajoutez ceci
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    game_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Et ceci
      references: {
        model: 'game_lists',
        key: 'game_list_id',
      },
    },
  }, {
    freezeTableName: true,
    timestamps: false,
  });

  return userLists;
};
