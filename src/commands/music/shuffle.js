const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("shuffle")
		.setDescription("Shuffles the queue."),
	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue || queue.tracks.length == 0) {
			return await interaction.followUp("Queue is empty!");
		}

		await queue.shuffle();

		return await interaction.followUp("Queue has been shuffled!");
	},
};
