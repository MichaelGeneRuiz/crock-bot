const { Users } = require("../dbObjects.js");
const { Events } = require("discord.js");

module.exports = {
  // When the bot is ready
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    // Sync the balances from the database to the currency collection
    const storedBalances = await Users.findAll();
    storedBalances.forEach((b) => client.currency.set(b.user_id, b));

    // Creates a date object for logging purposes
    const date = new Date();

    // Print that the bot is ready and set the bot's presence
    console.log(
      date.toLocaleString() + " | " + `Ready. Logged in as ${client.user.tag}.`
    );
    client.user.setActivity("Zaming Rn");
  },
};
