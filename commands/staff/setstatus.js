const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class setstatusCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'setstatus',
			group: 'staff',
			aliases: ['status'],
			memberName: 'setstatus',
			description: 'Sets the status',
			userPermissions: ['KICK_MEMBERS'],
			args: [
				{
					key: 'presenceType',
					prompt: 'What should the status start with? (you can choose between "Watching", "Playing", Streaming" and "Listening (to)")',
					type: 'string',
					oneOf: ['watching', 'playing', 'streaming', 'listening'],
				},
				{
					key: 'statusText',
					prompt: 'And what should be after that?',
					type: 'string',
				},
			],
		});
	}

	run(message, { presenceType, statusText }) {
		presenceType = presenceType.toUpperCase()
		this.client.user.setActivity(statusText, {type: presenceType})
	}
};