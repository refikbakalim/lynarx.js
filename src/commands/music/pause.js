const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pauses the current song."),
	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing) {
			return await interaction.followUp("No song is currently playing!");
		}

		if (queue.connection.paused) {
			return await interaction.followUp(
				"Player had already been paused!"
			);
		}

		queue.setPaused(true);

		return await interaction.followUp("Player has been paused!");
	},
};
