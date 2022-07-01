module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {

        // Set up role variables
        const userRole = reaction.message.guild.roles.cache.find(role => role.name === process.env.USER_ROLE);
        const tempRole = reaction.message.guild.roles.cache.find(role => role.name === process.env.TEMP_ROLE);
        const memberRole = reaction.message.guild.roles.cache.find(role => role.name === process.env.MEMBER_ROLE);

        // If the messages are not cached, wait for them to be
        if (reaction.message.partial) { await reaction.message.fetch(); }
        if (reaction.partial) { await reaction.fetch(); }

        // If the react was created by a bot or not on the server, return
        if (user.bot) { return; }
        if (!reaction.message.guild) { return; }

        // If the react is in the welcome channel
        if (reaction.message.channel.id === process.env.WELCOME_CHANNEL_ID) {
            // If the user role is selected
            if (reaction.emoji.name === process.env.USER_ROLE_EMOJI) {
                // Make them a user
                await reaction.message.guild.members.cache.get(user.id).roles.add(userRole);
            }
            // If the temp role is selected
            else if (reaction.emoji.name === process.env.TEMP_ROLE_EMOJI) {

                // If they are already a member
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.some(role => role.name === process.env.MEMBER_ROLE)) {
                    // Send a message that they are already a member
                    await user.client.channels.cache.get(process.env.WELCOME_CHANNEL_ID).send(`<@${user.id}>\nYou are already a member.`)
                    .then(msg => {
                        setTimeout(() => msg.delete(), 5000);
                    }).catch('oh no');
                }
                // Otherwise make them a temp member
                else {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(tempRole);

                    // Send a message in the secret channel
                    await user.client.channels.cache.get(process.env.SECRET_CHANNEL_ID).send(`<@${user.id}>\nReact to this message with the password emoji to receive the member role.`);
                }

            }
            else {
                // If it's not one of these two reactions, remove it
                await reaction.remove();
            }

        }
        // If the message is sent in the secret channel
        else if (reaction.message.channel.id === process.env.SECRET_CHANNEL_ID) {
            // If they respond with the secret emoji
            if (reaction.emoji.name === process.env.SECRET_EMOJI) {
                // Make them a member
                await reaction.message.guild.members.cache.get(user.id).roles.add(memberRole);
                await user.client.channels.cache.get(process.env.SECRET_CHANNEL_ID).send('Correct emoji. Adding Role')
                .then(() => {
                    setTimeout(() => reaction.message.guild.members.cache.get(user.id).roles.remove(tempRole), 5000);
                }).catch('oh no')
                .then(() => {
                    setTimeout(() => reaction.message.channel.bulkDelete(100), 5000);
                }).catch('oh no');
            }
            // Otherwise remove their temp role
            else {
                await user.client.channels.cache.get(process.env.SECRET_CHANNEL_ID).send('Incorrect emoji. Removing you in a few seconds.')
                .then(() => {
                    setTimeout(() => reaction.message.guild.members.cache.get(user.id).roles.remove(tempRole), 5000);
                }).catch('oh no')
                .then(() => {
                    setTimeout(() => reaction.message.channel.bulkDelete(100), 5000);
                }).catch('oh no');

            }
        }
        else {
            return;
        }
    },
};