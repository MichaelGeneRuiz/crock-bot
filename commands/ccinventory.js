const { SlashCommandBuilder } = require("@discordjs/builders");
const { Users } = require("../dbObjects.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  // Creates a new slash command
  data: new SlashCommandBuilder()
    .setName("ccinventory")
    .setDescription("Shows a user's inventory."),
  async execute(interaction) {
    // Gets the user's id and their items
    const target = interaction.user;
    const user = await Users.findOne({ where: { user_id: target.id } });

    if (!user) {
      return interaction.reply(
        "You do not possess any currency yet. Please do so before accessing the inventory or shop."
      );
    }

    const items = await user.getItems();

    items.sort((a, b) => b.amount - a.amount);

    // A message embed for the user's inventory + balance
    const inventoryEmbed = new EmbedBuilder()
      .setColor("#8c1567")
      .setTitle(`**${target.username}'s Inventory**`)
      .setDescription(
        `You have ${interaction.client.currency.getBalance(
          target.id
        )} CrockCoin`
      )
      .addFields(
        {
          name: "Items",
          value:
            items.length === 0
              ? "You have no items."
              : items.map((i) => `${i.item.name} ${i.item.icon}`).join("\n"),
          inline: true,
        },
        {
          name: "Quantity",
          value:
            items.length === 0
              ? "N/A"
              : items.map((i) => `${i.amount}`).join("\n"),
          inline: true,
        }
      );

    // Reply with the embed
    return interaction.reply({ embeds: [inventoryEmbed] });
  },
};
