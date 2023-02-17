const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Resumes the current song."),
	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing) {
			return await interaction.followUp("No song is currently paused!");
		}

		if (!queue.connection.paused) {
			return await interaction.followUp("Player is not paused!");
		}

		queue.setPaused(false);

		return await interaction.followUp("Player has been resumed!");
	},
};
