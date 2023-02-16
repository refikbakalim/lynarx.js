const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("now")
		.setDescription("Returns the current song"),
	async execute(interaction, client) {
		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue) {
			return await interaction.reply("There is no queue!");
		}

		if (queue.playing) {
			return await interaction.reply(
				`Now playing: **${queue.nowPlaying().title}**`
			);
		} else {
			return await interaction.reply("No song is currently playing!");
		}
	},
};
