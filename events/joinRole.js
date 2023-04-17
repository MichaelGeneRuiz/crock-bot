const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const userRole = member.guild.roles.cache.find(
      (role) => role.name === process.env.USER_ROLE
    );

    const nathanRole = member.guild.roles.cache.find(
      (role) => role.name === "NATHAN"
    );

    if (member.id === process.env.NATHAN_ID) {
      await member.roles.add(nathanRole);
    } else {
      await member.roles.add(userRole);
    }
  },
};
