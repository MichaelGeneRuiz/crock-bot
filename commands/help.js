const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  // Creates a new slash command
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lists all bot commands."),
  async execute(interaction) {
    // Creates a map of commands the bot has with a slash in front of them
    const command_list = interaction.client.commands.map(
      (command) => `/${command.data.name}`
    );

    // Filters out test commands from the list
    const filtered_command_list = command_list.filter(
      (command) => !command.includes("test")
    );

    // Creates a filtered list of currency commands
    const currency_command_list = filtered_command_list.filter((command) =>
      command.startsWith("/cc")
    );

    // Creates a filtered list of non-music and non-currency commands
    const other_command_list = filtered_command_list.filter(
      (command) =>
        !(
          command.includes("test") ||
          command.startsWith("/cc") ||
          command.includes("music")
        )
    );

    // Creates an embed with the list of commands
    const helpEmbed = new EmbedBuilder()
      // Purple
      .setColor("#8c1567")
      .setTitle("Command List")
      .setDescription(`Total commands: ${filtered_command_list.length}`)
      .addFields(
        {
          name: "Currency Commands",
          value: currency_command_list.join("\n"),
          inline: true,
        },
        { name: "Music Commands", value: "/music help *", inline: true },
        {
          name: "Other Commands",
          value: other_command_list.join("\n"),
          inline: true,
        }
      )
      .setFooter({
        text: "* These are often subcommands that list all of the subcommands of the main command.",
      });

    // Replies with the embed
    await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  },
};
