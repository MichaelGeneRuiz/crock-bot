// Necessary Requires
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { Users } = require('./dbObjects.js');
const { Player } = require('discord-music-player');
require('dotenv').config();

// Creation of the Client with Intents
const client = new Client({
	intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

// Creation of a currency Collection
client.currency = new Collection();

// Creates a method to add a certain amount of currency to a user's balance
// If the user does not exist, create one
Reflect.defineProperty(client.currency, 'add', {
	value: async function add(id, amount) {
		const user = client.currency.get(id);

		if (user) {
			user.balance += Number(amount);
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, balance: amount });
		client.currency.set(id, newUser);

		return newUser;
	},
});

// Creates a method to get a user's balance
Reflect.defineProperty(client.currency, 'getBalance', {
	value: function getBalance(id) {
		const user = client.currency.get(id);
		return user ? user.balance : 0;
	},
});

// Define a music player object
const player = new Player(client, {
	deafenOnJoin: true,
});

// Allow commands to easily access the music player
client.player = player;

// Creates a collection for slash commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Registers the slash commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Finds event files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Triggers one-time events, and listens for constant events
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Event listener for the music player
client.player
    // Emitted when channel was empty.
    .on('channelEmpty', () =>
        client.channels.cache.get(process.env.MUSIC_CHANNEL_ID)
		.send('Everyone left the voice channel. Leaving now...'))
    // Emitted when there was no more music to play.
    .on('queueEnd', () =>
		client.channels.cache.get(process.env.MUSIC_CHANNEL_ID)
		.send('There are no more songs in the queue. Leaving now...'))
    // Emitted when a song changed.
    .on('songChanged', (queue) =>
		client.channels.cache.get(process.env.MUSIC_CHANNEL_ID)
		.send(`Now playing: ${queue.songs[0]} [${queue.songs[0].duration}].`)
		.then(msg => setTimeout(() => msg.delete(), 10000)))
    // Emitted when there was an error in runtime
    .on('error', (error, queue) => {
		const date = new Date();
        console.log(date.toLocaleString() + ' | ' + `Error: ${error} in ${queue.guild.name}`);
    });

// Triggering slash commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) { return; }

	const command = client.commands.get(interaction.commandName);

	const date = new Date();

	if (!command) { return; }

	try {
		await command.execute(interaction);
		console.log(date.toLocaleString() + ' | ' + interaction.commandName + ' has been triggered by ' + interaction.user.tag);
	}
    catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Bot logging in
client.login(process.env.BOT_TOKEN);