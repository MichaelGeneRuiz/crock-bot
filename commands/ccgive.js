const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../dbObjects.js');

module.exports = {
    // Creates a new slash command
    data:  new SlashCommandBuilder()
        .setName('ccgive')
        .setDescription('Gives a user a specified amount of CrockCoins.')
        .addUserOption(option => option.setName('user').setDescription('Which user to give currency to.').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of currency to give.').setRequired(true)),
    async execute(interaction) {

        // Checks if the user exists within the database
        const target = interaction.user;
        const user = await Users.findOne({ where: { user_id: target.id } });

        if (!user) { return interaction.reply('You do not possess any currency yet. Please do so before continuing.'); }

        // Checks the balance of whoever triggered the command
        const currentAmount = interaction.client.currency.getBalance(target.id);

        // Assigns command arguments to variables
        const giveAmount = interaction.options.getInteger('amount');
        const giveTarget = interaction.options.getUser('user');

        // Handles if you do not have enough money
        if (giveAmount > currentAmount) { return interaction.reply(`You cannot give ${giveAmount} CrockCoin, as you only have ${currentAmount} CrockCoin`); }
        if (giveAmount <= 0) { return interaction.reply('Please give an amount greater than zero.'); }

        // Transfers the currency
        interaction.client.currency.add(target.id, -giveAmount);
        interaction.client.currency.add(giveTarget.id, giveAmount);

        // Confirms transaction
        return interaction.reply(`Successfully gave ${giveAmount} CrockCoin to ${giveTarget.username}. You now have ${interaction.client.currency.getBalance(interaction.user.id)} CrockCoin.`);
    },
};