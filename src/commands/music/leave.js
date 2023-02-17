const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("Kicks the bot from the channel."),
	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue) {
			await interaction.guild.members.me.voice.setChannel(null);
		} else {
			queue.destroy();
		}

		return await interaction.followUp("Left the channel.");
	},
};
