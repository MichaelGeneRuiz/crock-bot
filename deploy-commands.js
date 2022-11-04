// Necessary Requires
const fs = require("node:fs");
const { REST, Routes } = require("discord.js");
require("dotenv").config();

// Creates an array for commands and finds where to read files
const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Adds commands to the array
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Creates new REST
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

// Adds commands to the REST
async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
};
