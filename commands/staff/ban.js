const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class banCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			group: 'staff',
			memberName: 'ban',
			description: 'Bans a user, and sends them the ban appeal form',
			userPermissions: ['BAN_MEMBERS'],
			args: [
				{
				key: 'userToBan',
				prompt: 'who do you want to ban?',
				type: 'member',
				},
				{
				key: 'reason',
				prompt: 'what\'s the reason (optional, **visible to the user**)',
				type: 'string',
				default: '*No reason provided*',
				},
			],
		});
	}

	run(message, {userToBan, reason}) {
		if(!userToBan.bannable) {
			let embed = new MessageEmbed()
				.setTitle('Error!')
				.setColor(0x6b5cdf)
				.setDescription('I can\'t ban that user');
				return message.embed(embed)
		}

		let embed = new MessageEmbed()
		.setTitle('Ban user?')
		.setColor(0x6b5cdf)
		.addFields(
			{ name: 'User', value: '<@' + userToBan + '>' },
			{ name: 'Reason (visible to the banned user)', value: reason },
		)
		.setDescription('<@' + message.author.id + '>, to confirm, tap 🌮');
		message.embed(embed).then(sentEmbed => {
			sentEmbed.react("🌮")

			sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '🌮',
			{ max: 1, time: 30000 }).then(collected => {
				if (collected.first().emoji.name == '🌮') {
					let embed = new MessageEmbed()
						.setTitle('Great!')
						.setColor(0x6b5cdf)
						.setDescription('<@' + userToBan + '> has been banned by <@' + message.author.id + '>');
						
						message.embed(embed)
  					userToBan.send('You have been banned from the Vsauce3 Discord server. \n \n**Reason** \n' + reason + '\n \nIf you\'d like to send a ban appeal, follow this link: \nhttps://botsauce.github.io/banappeal')
  					setTimeout(() => {  userToBan.ban({ reason: reason }) }, 3000)
				}
			}).catch(console.log('catched'))
		})
	}
};