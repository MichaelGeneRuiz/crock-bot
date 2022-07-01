// Necessary Requires
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

// Creates an array for commands and finds where to read files
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Adds commands to the array
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Creates new REST
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

// Adds commands to the REST
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands to this guild.'))
	.catch(console.error);