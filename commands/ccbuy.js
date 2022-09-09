const { SlashCommandBuilder } = require("@discordjs/builders");
const { Users, CurrencyShop } = require("../dbObjects.js");
const { Op } = require("sequelize");

module.exports = {
  // Creates a new slash command
  data: new SlashCommandBuilder()
    .setName("ccbuy")
    .setDescription("Purchase an item from the shop using CrockCoins.")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Which item to purchase from the shop.")
        .setRequired(true)
        .addChoices(
          { name: "Pog", value: "Pog" },
          { name: "Wog", value: "Wog" },
          { name: "Flex Bucks", value: "Flex Bucks" },
          { name: "Nathan Token", value: "Nathan Token" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("How many of said item to purchase.")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Grab item name and associate it to item from shop
    const itemName = interaction.options.getString("item");
    const item = await CurrencyShop.findOne({
      where: { name: { [Op.like]: itemName } },
    });

    const user = await Users.findOne({
      where: { user_id: interaction.user.id },
    });

    if (!user) {
      return interaction.reply(
        "You do not possess any currency yet. Please do so before accessing the inventory or shop."
      );
    }

    // Exceptions
    // if (!item) { return interaction.reply('That item doesn\'t exist.'); }

    // Variables for amount of items
    const numItems = interaction.options.getInteger("amount");
    if (numItems <= 0) {
      return interaction.reply("Please purchase one or more items.");
    }

    // Calculate the total cost
    const totalCost = item.cost * numItems;

    // If you don't have enough money
    if (
      totalCost > interaction.client.currency.getBalance(interaction.user.id)
    ) {
      return interaction.reply(
        `You only have ${interaction.client.currency.getBalance(
          interaction.user.id
        )} CrockCoin, but ${numItems} ${item.name} ${
          item.icon
        } costs ${totalCost} CrockCoin.`
      );
    }

    // Purchasing the item
    interaction.client.currency.add(interaction.user.id, -totalCost);
    await user.addItem(item, numItems);

    // Purchase confirmation
    return interaction.reply(
      `You've bought: ${numItems} ${item.name} ${
        item.icon
      } for ${totalCost} CrockCoin. Your remaining balance is ${interaction.client.currency.getBalance(
        interaction.user.id
      )} CrockCoin.`
    );
  },
};
