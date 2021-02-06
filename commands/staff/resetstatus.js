const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class resetstatusCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'resetstatus',
			group: 'staff',
			memberName: 'resetstatus',
			description: 'Resets to the original status',
            userPermissions: ['KICK_MEMBERS'],
		});
	}

	run(message) {
        this.client.user.setActivity('\\help | Watching "Michael Says Prime Numbers for 3 Hours"', {type: 'LISTENING'});
	}
};