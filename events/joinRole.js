const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const userRole = member.guild.roles.cache.find(
      (role) => role.name === process.env.USER_ROLE
    );

    await member.roles.add(userRole);
  },
};
