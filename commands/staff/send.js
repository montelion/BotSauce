const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class sendCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'send',
			group: 'staff',
			memberName: 'send',
			description: 'Sends a message as the bot',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					key: 'channel',
					prompt: 'where should the bot send the message?',
					type: 'channel',
				},
				{
					key: 'content',
					prompt: 'and what should the content be?',
					type: 'string',
				},
			],
		});
	}

	run(message, { channel, content }) {
		let embed = new MessageEmbed()
		.setTitle('Send message?')
		.setColor(0x6b5cdf)
		.setDescription('<@' + message.author.id + '>, to confirm, tap 🌮')
		.addFields(
			{ name: 'Message', value: content },
		)
		message.embed(embed).then(sentEmbed => {
			sentEmbed.react("🌮")

			sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '🌮',
			{ max: 1, time: 30000 }).then(collected => {
				if (collected.first().emoji.name == '🌮') {
					
					channel.send(content)

					let embed = new MessageEmbed()
						.setTitle('Great!')
						.setColor(0x6b5cdf)
						.setDescription('<@' + message.author.id + '>, the message has been sent!');
						
						message.embed(embed)
				}
			});
		})
	}
};