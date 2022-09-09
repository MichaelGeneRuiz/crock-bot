const { SlashCommandBuilder } = require("@discordjs/builders");
const { CurrencyShop } = require("../dbObjects.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  // Creates a new slash command
  data: new SlashCommandBuilder()
    .setName("ccshop")
    .setDescription("Displays all items in the shop."),
  async execute(interaction) {
    // Find all shop items
    const items = await CurrencyShop.findAll();

    // Sort the shop by cost
    items.sort((a, b) => a.cost - b.cost);

    // Creates a shop embed
    const shopEmbed = new EmbedBuilder()
      .setColor("#8c1567")
      .setTitle("**The Crock Shop**")
      .addFields(
        {
          name: "Items",
          value: items.map((i) => `${i.name} ${i.icon}`).join("\n"),
          inline: true,
        },
        {
          name: "Cost",
          value: items.map((i) => `${i.cost} CrockCoin`).join("\n"),
          inline: true,
        }
      )
      .setThumbnail(
        "https://thumbs.dreamstime.com/b/gold-coin-value-vector-illustration-cartoon-style-isolated-gold-coin-value-vector-illustration-cartoon-style-113758813.jpg"
      );

    // Replies with the shop embed
    return interaction.reply({ embeds: [shopEmbed] });
  },
};
