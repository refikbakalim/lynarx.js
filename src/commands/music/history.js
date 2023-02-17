const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("history")
		.setDescription("Returns the queue history.")
		.addIntegerOption((option) =>
			option
				.setName("page")
				.setDescription("Specific page number in queue history.")
				.setRequired(false)
				.setMinValue(1)
		),

	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue || queue.previousTracks.length == 0) {
			return await interaction.followUp("No song history!");
		}

		const pageNumber = interaction.options.getInteger("page") ?? 1;

		const pageEnd = -10 * (pageNumber - 1) - 1;
		const pageStart = pageEnd - 10;
		let tracks = [];
		if (pageNumber == 1) {
			tracks = queue.previousTracks.slice(pageStart);
		} else {
			tracks = queue.previousTracks.slice(pageStart, pageEnd);
		}

		tracks = tracks.reverse().map((m, i) => {
			return `${i + pageEnd * -1}. **${m.title}** ([link](<${m.url}>))`;
		});

		return await interaction.followUp(
			`Current queue history:\n${tracks.join("\n")}${
				queue.previousTracks.length > pageStart * -1
					? `\n...${
							queue.previousTracks.length + pageStart
					  } more track(s)`
					: ""
			}`
		);
	},
};
