const { SlashCommandBuilder } = require('@discordjs/builders');
const { DailyRewards } = require('../dbObjects.js');
const ms = require('pretty-ms');

const timeout = 86400000;

module.exports = {
    // Creates a new slash command
    data:  new SlashCommandBuilder()
        .setName('ccdaily')
        .setDescription('Rewards you with a set amount of CrockCoin every day.'),
    async execute(interaction) {

        // Pulls the user from the database
        const user = await DailyRewards.findOne({ where: { user_id: interaction.user.id } });

        // Sets the time left to null
        let db_time = null;

        // If there is a user in the database, pull the saved time from the database
        if (user) {
            db_time = await user.time;
        }

        // If there is a time saved and the remaining time left is greater than zero
        if (db_time !== null && timeout - (Date.now() - db_time) > 0) {
            // Calculate the time left and display it with a message stating you cannot claim the daily reward yet
            const timeLeft = ms(timeout - (Date.now() - db_time));
            return interaction.reply(`You have already claimed your daily prize, come back in ${timeLeft}.`);
        }
        // Otherwise
        else {
            // Reward the amount of CrockCoin
            await interaction.client.currency.add(interaction.user.id, process.env.DAILY_REWARD);

            // If the user does not exist in the database, create one
            if (!user) {
                await DailyRewards.create({ user_id: interaction.user.id, time: Date.now() });
            }
            // otherwise, set the time in the database
            else {
                await user.setTime(Date.now());
            }

            // Responds that the daily has been awarded.
            return interaction.reply(`You claimed ${process.env.DAILY_REWARD} CrockCoin. You can claim again in 24 hours.`);
        }

    },
};