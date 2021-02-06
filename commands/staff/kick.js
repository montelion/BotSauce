const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class kickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kick',
			group: 'staff',
			memberName: 'kick',
			description: 'Kicks a user',
			userPermissions: ['KICK_MEMBERS'],
			args: [
				{
				key: 'userToKick',
				prompt: 'who do you want to kick?',
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

	run(message, {userToKick, reason}) {
		if(!userToKick.kickable) {
			let embed = new MessageEmbed()
				.setTitle('Error!')
				.setColor(0x6b5cdf)
				.setDescription('I can\'t kick that user');
				return message.embed(embed)
		}

		let embed = new MessageEmbed()
		.setTitle('Kick user?')
		.setColor(0x6b5cdf)
		.setDescription('**User:** \n<@' + userToKick + '> \n\n**Reason** \n' + (reason) + '\n \n<@' + message.author.id + '>, to confirm, tap 🌮');
		message.embed(embed).then(sentEmbed => {
			sentEmbed.react("🌮")

			sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '🌮',
			{ max: 1, time: 30000 }).then(collected => {
				if (collected.first().emoji.name == '🌮') {
					let embed = new MessageEmbed()
						.setTitle('Great!')
						.setColor(0x6b5cdf)
                        .setDescription('<@' + userToKick + '> has been kicked by <@' + message.author.id + '>');
                        message.embed(embed)
                    userToKick.kick({ reason: reason })
				}
			});
		})
	}
};