const { NathanMessage } = require('../dbObjects.js');

// Instantiate a cooldown variable
let cooldown = false;

// Function for random time before allowing message to be sent again
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
    // On creation of a message
    name: 'messageCreate',
    async execute(message) {

        // Creates a date object for logging purposes
        const date = new Date();

        // If the author is not Nathan, return
        if (message.author.id !== process.env.NATHAN_ID) { return; }

        // If the message was recently sent then return.
        if (cooldown === true) { return; }

        // Grabs the message content from the database
        const replymessage = await NathanMessage.findOne({ where: { message_id: '0' } });

        // Reply to him and set the cooldown
        message.reply(replymessage.message).catch((err) => console.log(err));
        cooldown = true;

        // Set cooldown time between 1 day and 2 days and print it to the console in minutes
        const cooldownTime = randInt(86400000, 172800000);
        console.log(date.toLocaleString() + ' | ' + `replyNathan has been activated and will be available again in ${Math.ceil(cooldownTime * (166667 / 10000000000))} minutes.`);

        // Set the cooldown variable back to false when the time is allotted.
        setTimeout(() => { cooldown = false; }, cooldownTime);
    },
};