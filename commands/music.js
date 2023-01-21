const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

const commandList = [
  "help",
  "play",
  "playlist",
  "skip",
  "stop",
  "repeaton",
  "repeatoff",
  "shuffle",
  "queue",
  "nowplaying",
  "remove",
  "progress",
];

module.exports = {
  // Creates a new slash command (with a lot of subcommands)
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Necessary prefix for all music commands.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("play")
        .setDescription("Adds the provided song to the queue.")
        .addStringOption((option) =>
          option
            .setName("song")
            .setDescription("The name or link of the song you want to play.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Adds the provided playlist to the queue.")
        .addStringOption((option) =>
          option
            .setName("playlist")
            .setDescription(
              "The name or link of the playlist you want to play."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("skip").setDescription("Skips the current song.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("stop").setDescription("Stops the current song.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("repeaton")
        .setDescription("Turns on repeat for the current song.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("repeatoff")
        .setDescription("Turns off repeat for the current song")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("shuffle")
        .setDescription("Shuffles the current queue.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("queue")
        .setDescription("Displays the songs currently in queue.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("nowplaying")
        .setDescription("Displays the current song.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes the song from the given position in queue.")
        .addIntegerOption((option) =>
          option
            .setName("index")
            .setDescription(
              "Which song to remove from the queue. (Queue Position)"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("progress")
        .setDescription("Shows the progress bar for the current song.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("help")
        .setDescription("Replies ephemerally with a list of music commands.")
    ),
  async execute(interaction) {
    // Creates a queue for the music player
    const guildQueue = interaction.client.player.createQueue(
      interaction.guild.id
    );

    // If the user wants to add a song to the queue
    if (interaction.options.getSubcommand() === "play") {
      if (!interaction.member.voice.channel) {
        return interaction.reply("You are not currently in a voice channel.");
      }

      await interaction.deferReply();

      try {
        const queue = interaction.client.player.createQueue(
          interaction.guild.id
        );
        await queue.join(interaction.member.voice.channel);
        const song = await queue
          .play(interaction.options.getString("song"))
          .catch(() => {
            if (!guildQueue) {
              queue.stop();

              return interaction.editReply("Error playing that song.");
            }
          });

        return interaction.editReply(
          `Song ${song} [${song.duration}] was added to the queue.`
        );
      } catch (error) {
        console.log(error.message);
        return interaction.editReply(
          "Something went wrong when queueing a song."
        );
      }
    }

    // If the user wants to add a playlist to the queue
    if (interaction.options.getSubcommand() === "playlist") {
      if (!interaction.member.voice.channel) {
        return interaction.reply("You are not currently in a voice channel.");
      }

      await interaction.deferReply();

      try {
        const queue = interaction.client.player.createQueue(
          interaction.guild.id
        );
        await queue.join(interaction.member.voice.channel);
        const song = await queue
          .playlist(interaction.options.getString("playlist"))
          .catch(() => {
            if (!guildQueue) {
              queue.stop();
            }

            return interaction.editReply("Error playing that playlist.");
          });

        return interaction.editReply(
          `Playlist ${song} was added to the queue.`
        );
      } catch (error) {
        console.log(error.message);
        return interaction.editReply(
          "Something went wrong when queuing a playlist."
        );
      }
    }

    // If the user wants to skip the current song
    if (interaction.options.getSubcommand() === "skip") {
      try {
        guildQueue.skip();

        return interaction.reply("Skipped the current song.");
      } catch (error) {
        console.log(error.message);
        return interaction.reply("Something went wrong when skipping.");
      }
    }

    // If the user wants to stop the music player
    if (interaction.options.getSubcommand() === "stop") {
      try {
        guildQueue.stop();

        return interaction.reply("Stopped the music player.");
      } catch (error) {
        console.log(error.message);
        return interaction.reply(
          "Something went wrong when stopping the queue."
        );
      }
    }

    // If the user wants the current song to repeat
    if (interaction.options.getSubcommand() === "repeaton") {
      try {
        guildQueue.setRepeatMode(1);

        return interaction.reply(
          "The current song will now be played on repeat."
        );
      } catch (error) {
        console.log(error.message);
        return interaction.reply(
          "Something went wrong when turning on repeat mode."
        );
      }
    }

    // If the user no longer wants the current song to repeat
    if (interaction.options.getSubcommand() === "repeatoff") {
      try {
        guildQueue.setRepeatMode(0);

        return interaction.reply(
          "The current song will no longer be played on repeat."
        );
      } catch (error) {
        console.log(error.message);
        return interaction.reply(
          "Something went wrong when turning off repeat mode."
        );
      }
    }

    // If the user wants to shuffle the queue
    if (interaction.options.getSubcommand() === "shuffle") {
      try {
        guildQueue.shuffle();

        return interaction.reply("The queue has been shuffled.");
      } catch (error) {
        console.log(error.message);
        return interaction.reply(
          "Something went wrong when turning on shuffle mode."
        );
      }
    }

    // If the user wants to see the songs currently in queue
    if (interaction.options.getSubcommand() === "queue") {
      // Creates a message embed for the music queue
      const queueEmbed = new EmbedBuilder()
        .setColor("#8c1567")
        .setTitle("**Music Queue**")
        .addFields({
          name: `**${guildQueue.songs.length} songs currently in queue:**\n`,
          value:
            guildQueue.songs.length === 0
              ? "There are no songs in the queue."
              : guildQueue.songs
                  .slice(0, 10)
                  .map(
                    (song) =>
                      `${guildQueue.songs.indexOf(song) + 1}. ${song} [${
                        song.duration
                      }]`
                  )
                  .join("\n"),
        });

      try {
        return interaction.reply({ embeds: [queueEmbed] });
      } catch (error) {
        console.log(error);
        return interaction.reply(
          "Something went wrong when attempting to view the queue."
        );
      }
    }

    // If the user wants to see the current song
    if (interaction.options.getSubcommand() === "nowplaying") {
      try {
        await interaction.reply(
          `Now playing: ${guildQueue.nowPlaying} [${guildQueue.nowPlaying.duration}]. `
        );
        await wait(10000);
        return interaction.deleteReply();
      } catch (error) {
        console.log(error);
        return interaction.reply(
          "Something went wrong when viewing the currently playing song."
        );
      }
    }

    // If the user wants to remove the current song from the queue
    if (interaction.options.getSubcommand() === "remove") {
      const index = interaction.options.getInteger("index") - 1;

      if (index < 0 || index > guildQueue.songs.length - 1) {
        return interaction.reply("Your inputted number is out of bounds.");
      }

      try {
        const removedSong = guildQueue.songs[index];

        guildQueue.remove(index);

        return interaction.reply(
          `Removed ${removedSong} [${removedSong.duration}] from the queue.`
        );
      } catch (error) {
        console.log(error.message);
        return interaction.reply(
          "Something went wrong when trying to remove that song from the queue."
        );
      }
    }

    // If the user wants to see the progress bar for the current song
    if (interaction.options.getSubcommand() === "progress") {
      try {
        const ProgressBar = guildQueue.createProgressBar();

        return interaction.reply(ProgressBar.prettier);
      } catch (error) {
        console.log(error.message);
        return interaction.reply("Something went wrong with the Progress bar.");
      }
    }

    // If the user wants a list of music commands
    if (interaction.options.getSubcommand() === "help") {
      // Creates an embed for the help subcommand
      const helpEmbed = new EmbedBuilder()
        .setColor("#8c1567")
        .setTitle("**Music Commands**")
        .addFields({
          name: `There are ${commandList.length} music commands`,
          value: commandList.map((command) => `/music ${command}`).join("\n"),
        });

      return interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }
  },
};
