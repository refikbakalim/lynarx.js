const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Returns the song queue"),
	async execute(interaction, client) {
		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue) {
			return await interaction.reply("There is no queue!");
		}

		if (queue.tracks.length == 0) {
			return await interaction.reply("Queue is empty!");
		} else {
			return await interaction.reply(
				`Current queue: ${queue.tracks
					.map((track, i) => {
						return `#${i + 1} - ${track.title}`;
					})
					.join("\n")}`
			);
		}
	},
};
