// Necessary Requires
const Sequelize = require("sequelize");

// Initializes database type and properties
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

// Initializes models
const Users = require("./models/Users.js")(sequelize, Sequelize.DataTypes);
const CurrencyShop = require("./models/CurrencyShop.js")(
  sequelize,
  Sequelize.DataTypes
);
const UserItems = require("./models/UserItems.js")(
  sequelize,
  Sequelize.DataTypes
);
const DailyRewards = require("./models/DailyRewards.js")(
  sequelize,
  Sequelize.DataTypes
);
const NathanMessage = require("./models/NathanMessage.js")(
  sequelize,
  Sequelize.DataTypes
);

// Adds currency shop as a property of UserItems
UserItems.belongsTo(CurrencyShop, { foreignKey: "item_id", as: "item" });

// Method to add items to a user's inventory
Reflect.defineProperty(Users.prototype, "addItem", {
  value: async function addItem(item, amount) {
    const userItem = await UserItems.findOne({
      where: { user_id: this.user_id, item_id: item.id },
    });

    if (userItem) {
      userItem.amount += amount;
      return userItem.save();
    }

    return UserItems.create({
      user_id: this.user_id,
      item_id: item.id,
      amount: amount,
    });
  },
});

// Method to get items from a user's inventory
Reflect.defineProperty(Users.prototype, "getItems", {
  value: function getItems() {
    return UserItems.findAll({
      where: { user_id: this.user_id },
      include: ["item"],
    });
  },
});

// Sets the time left from the database (strictly if there exists a user)
Reflect.defineProperty(DailyRewards.prototype, "setTime", {
  value: async function setTime(time) {
    const user = await DailyRewards.findOne({
      where: { user_id: this.user_id },
    });

    user.time = time;
    return user.save();
  },
});

// Changes the message in the database to a new message
Reflect.defineProperty(NathanMessage.prototype, "setMessage", {
  value: async function setMessage(newMessage) {
    const message = await NathanMessage.findOne({ where: { message_id: "0" } });

    message.message = newMessage;
    return message.save();
  },
});

// Exports these Models to other files
module.exports = {
  Users,
  CurrencyShop,
  UserItems,
  DailyRewards,
  NathanMessage,
};
