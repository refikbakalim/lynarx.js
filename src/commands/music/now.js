const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("now")
		.setDescription("Returns the current song."),
	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing) {
			return await interaction.followUp("No song is currently playing!");
		}

		return await interaction.followUp(
			`Now playing: **${queue.nowPlaying().title}**`
		);
	},
};
