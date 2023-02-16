const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skips the current song"),

	async execute(interaction, client) {
		const queue = client.player.getQueue(interaction.guild.id);

		if (!queue) {
			return await interaction.reply("There is no queue!");
		}

		await interaction.deferReply();

		const currentSong = queue.nowPlaying();

		if (queue.tracks.length > 0) {
			await queue.play();
			const nextSong = queue.nowPlaying();
			return await interaction.followUp(
				` ❌ | Skipped **${currentSong.title}**!\n:white_check_mark: | Now playing! **${nextSong.title}**`
			);
		} else {
			await queue.skip();
			await queue.clear();
			return await interaction.followUp(
				` ❌ | Skipped **${currentSong.title}**!\n❌ | No songs in the queue!`
			);
		}
	},
};
