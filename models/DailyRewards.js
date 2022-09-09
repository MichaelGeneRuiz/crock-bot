// Creates a DailyRewards model
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "daily_rewards",
    {
      // User
      user_id: DataTypes.STRING,
      // Time left
      time: DataTypes.INTEGER,
    },
    {
      timestamps: false,
    }
  );
};
