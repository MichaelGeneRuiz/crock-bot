const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageReactionRemove,
  async execute(reaction, user) {
    // Seet up role variables
    const userRole = reaction.message.guild.roles.cache.find(
      (role) => role.name === process.env.USER_ROLE
    );
    const tempRole = reaction.message.guild.roles.cache.find(
      (role) => role.name === process.env.TEMP_ROLE
    );

    // If the messages are not cached, wait for them to be
    if (reaction.message.partial) {
      await reaction.message.fetch();
    }
    if (reaction.partial) {
      await reaction.fetch();
    }

    // If the react was created by a bot or not on the server, return
    if (user.bot) {
      return;
    }
    if (!reaction.message.guild) {
      return;
    }

    // If the reacts are in the welcome channel
    if (reaction.message.channel.id === process.env.WELCOME_CHANNEL_ID) {
      // If the user role is deselected
      if (reaction.emoji.name === process.env.USER_ROLE_EMOJI) {
        // Remove user role
        await reaction.message.guild.members.cache
          .get(user.id)
          .roles.remove(userRole);
      }

      // If the temp role is deselected
      if (reaction.emoji.name === process.env.TEMP_ROLE_EMOJI) {
        // Remove temp role
        await reaction.message.guild.members.cache
          .get(user.id)
          .roles.remove(tempRole);
      }
    } else {
      return;
    }
  },
};
