const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    // Creates a new slash command
    data:  new SlashCommandBuilder()
        .setName('cctestgive')
        .setDescription('Gives a user a specified amount of CrockCoin.')
        .addIntegerOption(option => option.setName('int').setDescription('Amount of currency to give.').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('Which user to give currency to.').setRequired(true)),
    async execute(interaction) {
        // Gets the user's id
        const user = interaction.options.getUser('user');

        // Gets the amount of currency to be given
        const amount = interaction.options.getInteger('int');

        // Test command
        if (interaction.user.id === process.env.CREATOR_ID) {
            await interaction.client.currency.add(user.id, amount);
            return interaction.reply({ content: 'Done', ephemeral: true });
        }
        else {
            return interaction.reply('You do not have permission to use that command');
        }
    },
};