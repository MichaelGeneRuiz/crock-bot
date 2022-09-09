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
const DailyRewards = require("./models/DailyRewards.js")(
  sequelize,
  Sequelize.DataTypes
);
const CurrencyShop = require("./models/CurrencyShop.js")(
  sequelize,
  Sequelize.DataTypes
);
const NathanMessage = require("./models/NathanMessage.js")(
  sequelize,
  Sequelize.DataTypes
);
require("./models/Users.js")(sequelize, Sequelize.DataTypes);
require("./models/UserItems.js")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

// Syncs shop items to database
sequelize
  .sync({ force })
  .then(async () => {
    const shop = [
      CurrencyShop.upsert({ name: "Pog", cost: 1, icon: "(P)" }),
      CurrencyShop.upsert({ name: "Wog", cost: 2, icon: "(W)" }),
      CurrencyShop.upsert({ name: "Nathan Token", cost: 1000, icon: "(N)" }),
      CurrencyShop.upsert({ name: "Flex Bucks", cost: 10000, icon: "💸" }),
    ];

    await Promise.all(shop);
    console.log("Database synced.");

    sequelize.close();
  })
  .catch(console.error);

// Code to remove an object from the system using its name
// CurrencyShop.destroy({ where: { name: 'Flex Bucks' } }, );

// Create the Daily Rewards table
DailyRewards.sync();
console.log("Daily Rewards synced.");

NathanMessage.sync();
console.log("Nathan Message synced.");
