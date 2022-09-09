// Creates a UserItems model
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user_item",
    {
      // User
      user_id: DataTypes.STRING,
      // Item
      item_id: DataTypes.INTEGER,
      // Amount of items
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
      },
    },
    {
      timestamps: false,
    }
  );
};
