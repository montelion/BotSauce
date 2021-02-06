const { Command } = require('discord.js-commando');

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['end', 'dc', 'disconnect', 'die', 'yeet'],
			group: 'main',
			memberName: 'stop',
			description: 'Stops whatever the bot is playing',
		});
	}

	run(message) {
		message.guild.me.voice.channel.leave();
		message.react('✅')
	}
};