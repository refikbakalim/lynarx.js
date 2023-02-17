const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("Clears the queue."),
	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue || queue.tracks.length == 0) {
			return await interaction.followUp("Queue is already empty!");
		}

		queue.clear();

		return await interaction.followUp("Cleared queue!");
	},
};
