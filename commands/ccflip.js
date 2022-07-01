const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../dbObjects.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    // Creates a new slash command
    data:  new SlashCommandBuilder()
        .setName('ccflip')
        .setDescription('Coin flip game to win more CrockCoin.')
        .addIntegerOption(option => option.setName('wager').setDescription('Amount of currency to bet on the coin flip.').setRequired(true))
        .addStringOption(option => option.setName('side').setDescription('Heads or Tails?').setRequired(true).addChoice('Heads', 'Heads').addChoice('Tails', 'Tails')),
    async execute(interaction) {
        // Gets the user's id and checks if they exist
        const target = interaction.user;
        const user = await Users.findOne({ where: { user_id: target.id } });

        if (!user) { return interaction.reply('You do not possess any currency yet. Please obtain some before continuing.'); }

        // Checks how much money the user has
        const userCurrency = interaction.client.currency.getBalance(target.id);

        // Grabs the wager amount
        const wager = interaction.options.getInteger('wager');

        // Currency checks
        if (userCurrency < wager) { return interaction.reply(`You cannot wager ${wager} CrockCoin, as you only have ${userCurrency} CrockCoin`); }
        if (wager <= 0) { return interaction.reply('Please wager an amount greater than zero.'); }

        // A message embed for the game
        const flipEmbed = new MessageEmbed()
        .setColor('#8c1567')
        .setTitle('**Coin Flip**')
        .setDescription(`You have ${interaction.client.currency.getBalance(target.id)} CrockCoin.`)
        .addFields(
            { name: 'Wager', value: `${wager} CrockCoin`, inline: true },
            { name: 'Odds', value: '1-1', inline: true },
            { name: 'Results', value: 'Flipping...' },
        );

        // Replies with the embed
        await interaction.reply({ embeds: [flipEmbed] });

        // Creates sleep promise
        const sleep = m => new Promise(r => setTimeout(r, m));
        await sleep(3000);

        // Generates coin flip result
        const result = Math.floor(Math.random() * 2);

        // Creates a message embed for the results of the coin flip
        const resultEmbed = new MessageEmbed(flipEmbed).spliceFields(2, 1, { name: 'Results', value: (result == 0) ? 'The coin landed on heads.' : 'The coin landed on tails.' });

        await interaction.editReply({ embeds: [resultEmbed] });

        await sleep(1500);

        // Awards the money
        if (result == 0 && interaction.options.getString('side') == 'Heads') {

            interaction.client.currency.add(target.id, wager);
            const winningEmbed = new MessageEmbed(resultEmbed).setFooter({ text: `Congratulations! You won ${wager} CrockCoin! You now have ${interaction.client.currency.getBalance(target.id)} CrockCoin.` });
            await interaction.editReply({ embeds: [winningEmbed] });


        }
        else if (result == 1 && interaction.options.getString('side') == 'Tails') {

            interaction.client.currency.add(target.id, wager);
            const winningEmbed = new MessageEmbed(resultEmbed).setFooter({ text: `Congratulations! You won ${wager} CrockCoin! You now have ${interaction.client.currency.getBalance(target.id)} CrockCoin.` });
            await interaction.editReply({ embeds: [winningEmbed] });

        }
        else {

            interaction.client.currency.add(target.id, -wager);
            const winningEmbed = new MessageEmbed(resultEmbed).setFooter({ text: `Unlucky... You lost ${wager} CrockCoin... You now have ${interaction.client.currency.getBalance(target.id)} CrockCoin.` });
            await interaction.editReply({ embeds: [winningEmbed] });

        }

    },
};