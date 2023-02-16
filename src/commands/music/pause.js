const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pauses the current song"),
	async execute(interaction, client) {
		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue) {
			return await interaction.reply("There is no queue!");
		}

		queue.setPaused(true);

		return await interaction.reply("Player has been paused!");
	},
};
