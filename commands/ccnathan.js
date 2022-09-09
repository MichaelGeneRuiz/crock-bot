const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  NathanMessage,
  Users,
  UserItems,
  CurrencyShop,
} = require("../dbObjects.js");
const { Op } = require("sequelize");

module.exports = {
  // Creates a new slash command
  data: new SlashCommandBuilder()
    .setName("ccnathan")
    .setDescription(
      "Changes the replyNathan message if you have a nathan token."
    )
    .addStringOption((option) =>
      option
        .setName("newmessage")
        .setDescription("The message the bot will use.")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Gets the user from the database
    const user = await Users.findOne({
      where: { user_id: interaction.user.id },
    });

    // If the user does not exist in the database, return
    if (!user) {
      return interaction.reply(
        "You do not possess any currency yet. Please do so before accessing this command."
      );
    }

    // Fetches the string from the interaction options
    const newMessage = interaction.options.getString("newmessage");

    // Fetch the replyNathan message from the database
    const message = await NathanMessage.findOne({ where: { message_id: "0" } });

    // If the replyNathan message does not exist, create a test message
    if (!message) {
      await NathanMessage.create({ message_id: "0", message: "test" });
    }

    // Set the item to the Nathan Token from the shop
    const item = await CurrencyShop.findOne({
      where: { name: { [Op.like]: "Nathan Token" } },
    });

    // The nathan token item in the user's inventory
    const nathantokens = await UserItems.findOne({
      where: { user_id: user.user_id, item_id: item.id },
    });

    // If the user has the nathan tokens initialized
    if (nathantokens) {
      // If they have nathan tokens
      if (nathantokens.amount > 0) {
        // Set the replyNathan message
        await message.setMessage(newMessage);

        // Remove a nathan token
        await user.addItem(item, -1);

        // Reply to the user
        return interaction.reply(
          `The replyNathan message has been set to:\n ${newMessage}`
        );
      } else {
        // Tell the user they don't have enough tokens
        return interaction.reply(
          "You need at least 1 Nathan Token to use this command."
        );
      }
    } else {
      // Tell the user they don't have enough tokens
      return interaction.reply(
        "You need at least 1 Nathan Token to use this command."
      );
    }
  },
};
