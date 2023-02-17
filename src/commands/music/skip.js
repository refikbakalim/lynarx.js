const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skips the current song."),

	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing) {
			return await interaction.followUp("No song is currently playing!");
		}

		const currentSong = queue.nowPlaying();

		if (queue.tracks.length > 0) {
			await queue.play();
			const nextSong = queue.nowPlaying();
			return await interaction.followUp(
				`Skipped! **${currentSong.title}**!\nPlaying! **${nextSong.title}**`
			);
		}
		await queue.skip();
		return await interaction.followUp(
			`Skipped **${currentSong.title}**!\nQueue is empty!`
		);
	},
};
