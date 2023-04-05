const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  // Creates a new slash command
  data: new SlashCommandBuilder()
    .setName("testwelcome")
    .setDescription("Sets up the welcome chat box."),
  async execute(interaction) {
    const target = interaction.user;

    if (target.id === process.env.CREATOR_ID) {
      const tempEmoji = interaction.guild.emojis.cache.find(
        (emoji) => emoji.name === process.env.TEMP_ROLE_EMOJI
      );

      // Send a message in the welcome channel
      const message = await interaction.client.channels.cache
        .get(process.env.WELCOME_CHANNEL_ID)
        .send(`Select ${tempEmoji} if you know the member password.`);

      // React with the proper role emojis
      message
        .react(tempEmoji)
        .catch((error) =>
          console.error("One of the emojis failed to react: ", error)
        );

      return interaction.reply({ content: "Done", ephemeral: true });
    } else {
      return interaction.reply({
        content: "You do not have permission to use that command",
        ephemeral: true,
      });
    }
  },
};
