const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class OrisitCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'orisit',
			aliases: ['moonmen', 'vsaucetheme'],
			group: 'main',
			memberName: 'orisit',
			description: '***B A Z I N G A***',
		});
	}

	run(message) {
		async function music() {
			if (!message.guild) return;
			if (!message.member.voice.channel) {
				return message.say('https://youtu.be/TN25ghkfgQA');
			}

			if (message.member.voice.channel) {
				const connection = await message.member.voice.channel.join();
				const dispatcher = connection.play(fs.createReadStream('./commands/main/res/audio/orisit.mp3'));
				
				let embed = new MessageEmbed()
				.setColor(0x6b5cdf)
				.setTitle('Now playing:')
				.setDescription('"Moon Men" by Jake Chudnow (a.k.a. the Vsauce theme)\n*Requested by <@' + message.author.id + '>*')
			
					dispatcher.on('finish', () => {
					message.guild.me.voice.channel.leave();

					dispatcher.on('error', console.error);
				})
				return message.embed(embed)    
			}
		}
		return music()
	}
};