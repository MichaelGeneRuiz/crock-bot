const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../dbObjects.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  // Creates a new slash command
  data: new SlashCommandBuilder()
    .setName("cctestbalances")
    .setDescription("Checks the balances for every user in the discord."),
  async execute(interaction) {
    // Gets the user's id
    const target = interaction.user;

    // Test command
    if (target.id === process.env.CREATOR_ID) {
      await interaction.deferReply({ ephemeral: true });

      // Query the database
      const storedBalances = await Users.findAll();

      // Get the server member cache
      const server = interaction.guild;
      await server.members.fetch();

      if (!storedBalances) {
        return interaction.editReply("No entries in the database, please fix.");
      }

      storedBalances.sort((a, b) => b.balance - a.balance);

      const balanceEmbed = new EmbedBuilder()
        .setColor("#8c1567")
        .setTitle("Balance List")
        .setDescription(`Total Users with Currency: ${storedBalances.length}`)
        .addFields(
          {
            name: "Users",
            value: storedBalances
              .map((b) => `${server.members.cache.get(b.user_id).user.tag}`)
              .join("\n"),
            inline: true,
          },
          {
            name: "Balance",
            value: storedBalances
              .map((b) => `${b.balance} CrockCoin`)
              .join("\n"),
            inline: true,
          }
        );

      // Returns all balances
      return interaction.editReply({ embeds: [balanceEmbed] });
    } else {
      return interaction.reply({
        content: "You do not have permission to use that command",
        ephemeral: true,
      });
    }
  },
};
