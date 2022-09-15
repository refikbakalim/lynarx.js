const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Returns bot ping.'),
	async execute(interaction) {
		const message = await interaction.deferReply({
			fetchReply : true,
		});

		const newMessage = `API Latency: ${interaction.client.ws.ping}ms\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}ms`;
		await interaction.editReply({
			content: newMessage,
		});
	},
};