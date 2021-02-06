const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'main',
			memberName: 'help',
			description: 'Displays the help embed',
		});
	}

	run(message) {
		if (message.member.permissions.has('KICK_MEMBERS')) {
			let embed = new MessageEmbed()
			.setTitle('Commands')
			.setURL('https://botsauce.github.io/staff')
			.setColor(0x6b5cdf)
			.addFields(
				{ name: '\\social', value: 'Jake\'s social media accounts' },
				{ name: '\\randomvideo', value: 'Links to a randomly selected Vsauce3 video' },
				{ name: '\\caulk', value: '\'cause I don\'t think you can handle it. You can\'t handle...* this command' },
				{ name: '\\weigh', value: 'What does this command do? *Mmm, very good question. But more importantly... how much does it weigh?*' },
				{ name: '\\fingers', value: 'Hey, Vsauce. Michael here. *Where are your fingers?*' },
				{ name: '\\succ', value: '***S  U  C  C***' },
				{ name: '\\bazinga', value: '***B A Z I N G A***' },
				{ name: '\\orisit', value: 'Plays "Moon Men" by Jake Chudnow (a.k.a. the Vsauce theme)' },
				{ name: '\\stop', value: 'Stops playback' },
				{ name: '🔨 \\setstatus', value: 'Sets a custom status for the bot.\n*Usage: \\setstatus followed by the status*' },
				{ name: '🔨 \\resetstatus', value: 'Resets the status to its original state' },
				{ name: '🔨 \\ban (admin only)', value: 'Bans a user (duh). Usage: **\\ban** *@[user]* *[reason(optional)]* and sends them the complaint form' },
				{ name: '🔨 \\kick', value: 'Kicks a user (duh). Usage: **\\kick** *@[user]* *[reason(optional)]*' },			
				{ name: '🔨 \\send', value: 'Sends a message as the bot. Usage: **\\send** *#channel* *Message content*' },
				{ name: '🔨 \\edit', value: 'Edits a message sent by/as the bot. Usage: **\\edit** *message URL* New message content' },
			)
			return message.embed(embed);
		}
		
		else {
			let embed = new MessageEmbed()
			.setTitle('Commands')
			.setURL('https://botsauce.github.io')
			.setColor(0x6b5cdf)
			.addFields(
				{ name: '\\social', value: 'Jake\'s social media accounts' },
				{ name: '\\randomvideo', value: 'Links to a randomly selected Vsauce3 video' },
				{ name: '\\caulk', value: '\'cause I don\'t think you can handle it. You can\'t handle...* this command' },
				{ name: '\\weigh', value: 'What does this command do? *Mmm, very good question. But more importantly... how much does it weigh?*' },
				{ name: '\\fingers', value: 'Hey, Vsauce. Michael here. *Where are your fingers?*' },
				{ name: '\\succ', value: '***S  U  C  C***' },
				{ name: '\\bazinga', value: '***B A Z I N G A***' },
				{ name: '\\orisit', value: 'Plays "Moon Men" by Jake Chudnow (a.k.a. the Vsauce theme)' },
				{ name: '\\stop', value: 'Stops playback' }
			)
			return message.embed(embed);
		}
	}
};