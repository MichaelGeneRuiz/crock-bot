# crock-bot
This bot was created for my private discord server created using DiscordJS.

# Features
Currently the bot possesses the following features:
- Basic Currency System (an item shop, daily rewards, simple gambling)
- Music Functionality (using the Discord Music Player module)
- Automated Role Assignment (including a 'password protected' role)
- Automated Responses to Certain Users.

# Feature Explanations
## Currency System
`/ccdaily`

Currently, users are able to receive their first batch of currency by using this command. Once a user activates this command, the server's database will keeps track of how much time is left until they can use the command again.

`/ccshop`

This command allows users to view the server's item shop.

`/ccbuy`

Users can use this command to purchase items from the shop.

`/ccinventory`

This command allows users to access their inventory, which displays the amount of currency and any items they possess.

`/ccgive`

This command allows users to give each other their own currency.

`/ccflip`

This command allows the user to gamble a certain amount of currency, and win or lose that amount depending on the result of the coin flip.

`/ccnathan`

This command allows the user to change the message that the bot uses to reply to a specific user. The user must possess a certain item from the item shop to use this command. (More info in the 'Automated Responses to Certain Users' section).

## Music Functionality
There are many subcommands of the `/music` command. To simplify, the bot can do the following:

- Play both individual songs and playlists.
- Provide music player functionality, such as skipping, pausing, looping, and shuffling.
- Display the current queue of music, as well as remove a specific song from the queue.
- Display the name of the current song, as well as a progress bar for the remaining length of the song.

## Automated Role Assignment
A welcome message is generated using the `/testwelcome` command. The bot assigns a role when the user reacts to one of the provided message reactions.

If the user tries to access the member role, they will be given access to a secret channel that is only visible to them. They will be pinged and told to respond to the message in the secret channel with a 'password'. If the user reacts with the incorrect password, they are removed from the secret channel and the messages within that channel are purged. They are welcome to try again, but will not received full access to the server until they provide the correct password. If they react with the correct password, they will be given access to the rest of the server. They are removed from the secret channel and its contents are again purged.

## Automated Responses to Certain Users
The bot listens for messages sent by a certain user. If a message is detected, the bot will respond in a given manner. The bot will then have a randomly generated cooldown period, in which the bot will not respond to them in this manner for that cooldown period.

# Planned Features
The following features are planned for the future:
- A practical use for the server's shop items.
- More ways to gamble the server's currency.
- Other cool little quirks and features.