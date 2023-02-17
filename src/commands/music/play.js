const { SlashCommandBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Plays a song.")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Searches for a song and plays it.")
				.addStringOption((option) =>
					option
						.setName("search_terms")
						.setDescription("search keywords")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Plays songs from playlist(Youtube, Spotify).")
				.addStringOption((option) =>
					option
						.setName("url")
						.setDescription("the playlist's url")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription(
					"Plays a single song from url(Youtube, Spotify)."
				)
				.addStringOption((option) =>
					option
						.setName("url")
						.setDescription("the song's url")
						.setRequired(true)
				)
		),
	async execute(interaction, client) {
		await interaction.deferReply();

		if (!interaction.member.voice.channelId)
			return await interaction.followUp({
				content: "You are not in a voice channel!",
				ephemeral: true,
			});

		if (
			interaction.guild.members.me.voice.channelId &&
			interaction.member.voice.channelId !==
				interaction.guild.members.me.voice.channelId
		)
			return await interaction.followUp({
				content: "You are not in my voice channel!",
				ephemeral: true,
			});

		const queue = client.player.createQueue(interaction.guild, {
			disableVolume: true,
			leaveOnEndCooldown: 60000,
			leaveOnEmptyCooldown: 20000,
			metadata: {
				channel: interaction.channel,
			},
		});

		try {
			if (!queue.connection)
				await queue.connect(interaction.member.voice.channel);
		} catch (error) {
			console.error(error);
			queue.destroy();
			return await interaction.followUp({
				content: "Could not join your voice channel!",
				ephemeral: true,
			});
		}

		if (interaction.options.getSubcommand() === "song") {
			let url = interaction.options.getString("url");

			const result = await client.player.search(url, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO,
			});

			if (result.tracks.length === 0)
				return interaction.followUp("No results!");

			const track = result.tracks[0];

			if (queue.playing) {
				await queue.addTrack(track);
				return await interaction.followUp({
					content: `Added to queue! **${track.title}**`,
				});
			} else {
				await queue.play(track);
				return await interaction.followUp({
					content: `Now playing! **${track.title}**`,
				});
			}
		} else if (interaction.options.getSubcommand() === "playlist") {
			let url = interaction.options.getString("url");
			const result = await client.player.search(url, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO,
			});

			if (result.tracks.length === 0)
				return interaction.followUp(
					`No playlist found with this url! ${url}`
				);

			await queue.addTracks(result.tracks);

			if (!queue.playing) {
				await queue.play();
				return await interaction.followUp({
					content: `Now playing! **${queue.nowPlaying().title}**`,
				});
			}

			return await interaction.followUp({
				content: `Playlist added to queue!`,
			});
		} else if (interaction.options.getSubcommand() === "search") {
			let query = interaction.options.getString("search_terms");
			const track = await client.player
				.search(query, {
					requestedBy: interaction.user,
					searchEngine: QueryType.AUTO,
				})
				.then((x) => x.tracks[0]);
			if (!track)
				return await interaction.followUp({
					content: `Not found! **${query}**`,
				});

			if (queue.playing) {
				await queue.addTrack(track);
				return await interaction.followUp({
					content: `Added to queue! **${track.title}**`,
				});
			} else {
				await queue.play(track);
				return await interaction.followUp({
					content: `Now playing! **${track.title}**`,
				});
			}
		}
	},
};
