const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Returns the queue."),
	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue || queue.tracks.length == 0) {
			return await interaction.followUp("Queue is empty!");
		}

		return await interaction.followUp(
			`Current queue:\n ${queue.tracks
				.map((track, i) => {
					return `#${i + 1} - ${track.title}`;
				})
				.join("\n")}`
		);
	},
};
