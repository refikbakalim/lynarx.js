const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("back")
		.setDescription(
			"Plays the previous track. If not found, plays the current track again."
		),
	async execute(interaction, client) {
		await interaction.deferReply();
		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue) {
			return await interaction.followUp("No previous tracks!");
		}

		if (queue.previousTracks.length > 1 && queue.playing) {
			queue.back();
			const previousTrack = queue.nowPlaying();
			return await interaction.followUp(
				`Playing! **${previousTrack.title}**`
			);
		} else if (
			queue.previousTracks.length == 1 ||
			(queue.previousTracks.length > 1 && !queue.playing)
		) {
			const previousTrack =
				queue.previousTracks[queue.previousTracks.length - 1];
			queue.play(previousTrack);
			return await interaction.followUp(
				`Playing! **${previousTrack.title}**`
			);
		}
		return await interaction.followUp("No previous tracks!");
	},
};
