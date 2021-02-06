const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'monty',
			group: 'main',
			memberName: 'monty',
			description: 'Reacts with 🇲🇴🇳🇹🇾 to any message',
			args: [
				{
					key: 'url',
					prompt: 'Link the message',
					type: 'string',
				}
			],
		});
	}

	run(message, { url }) {
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

		message.guild.channels.cache.get(chnlID).messages.fetch(msgID).then(m => {
			m.react('🇲').then(() => {
				m.react('🇴').then(() => {
					m.react('🇳').then(() => {
						m.react('🇹').then(() => {
							m.react('🇾') // YandereDev 2: Electric Boogaloo - .then() chains
						})
					})
				})
			})

			let embed = new MessageEmbed()
			.setTitle('Great!')
			.setColor(0x6b5cdf)
			.setDescription('<@' + message.author.id + '>, [here](https://discord.com/channels/' + srvrID + '/' + chnlID + '/' + msgID + ')\'s the message');
						
			message.embed(embed)
		})
	}
};