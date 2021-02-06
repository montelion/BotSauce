const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class editCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'edit',
			group: 'staff',
			memberName: 'edit',
			description: 'Edits a message sent as the bot',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					key: 'url',
					prompt: 'Link the message',
					type: 'string',
				},
				{
					key: 'content',
					prompt: 'What should the new content be?',
					type: 'string',
				},
			],
		});
	}

	run(message, { url, content }) {
		const urlArray = url.split('/');

		if (urlArray[0] !== 'https:' || urlArray[4] !== message.guild.id) {
			let embed = new MessageEmbed()
			.setTitle('Something went wrong...')
			.setColor(0x6b5cdf)
			.setDescription('<@' + message.author.id + '>, are you sure you copied the right thing?')
			.addFields(
				{ name: 'Examples', value: `[https://discord.com/channels/${message.guild.id}/.../...](https://discord.com/channels/563066002724880384/563066002724880404/746746020200841336) \n[https://www.discord.com/channels/${message.guild.id}/.../...](https://youtu.be/dQw4w9WgXcQ) \n[https://ptb.discord.com/channels/${message.guild.id}/.../...](https://youtu.be/dQw4w9WgXcQ) \n[https://canary.discord.com/channels/${message.guild.id}/.../...](https://youtu.be/dQw4w9WgXcQ)` },
			)
			return message.embed(embed)
		}

		let srvrID = urlArray[4]
		let chnlID = urlArray[5]
		let msgID = urlArray[6]

		let embed = new MessageEmbed()
		.setTitle('Edit message?')
		.setColor(0x6b5cdf)
		.setDescription('<@' + message.author.id + '>, to confirm, tap 🌮')
		.addFields(
			{ name: 'Message URL', value: `https://discord.com/channels/${srvrID}/${chnlID}/${msgID}` },
		)
		message.embed(embed).then(e => {
			e.react("🌮")

			e.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '🌮',
			{ max: 1, time: 30000 }).then(collected => {
				if (collected.first().emoji.name == '🌮') {
					message.guild.channels.cache.get(chnlID).messages.fetch(msgID).then(m => {
						m.edit(content)

						let embed = new MessageEmbed()
							.setTitle('Great!')
							.setColor(0x6b5cdf)
							.setDescription('<@' + message.author.id + '>, [here](https://discord.com/channels/' + srvrID + '/' + chnlID + '/' + msgID + ')\'s the edited message');
						
						message.embed(embed)
					})
				}
			});
		})
	}
};