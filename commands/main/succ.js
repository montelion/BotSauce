const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class SuccCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'succ',
			aliases: ['risetotheoccasion'],
			group: 'main',
			memberName: 'succ',
			description: '***S  U  C  C***',
		});
	}

	run(message) {
		async function music() {
			if (!message.guild) return;
			if (!message.member.voice.channel) {
				return message.say('***S  U  C  C*** \nhttps://clips.twitch.tv/CoyTenuousMosquitoPMSTwin');
			}

			if (message.member.voice.channel) {
				const connection = await message.member.voice.channel.join();
				const dispatcher = connection.play(fs.createReadStream('./commands/main/res/audio/succ.mp3'));
				
				let embed = new MessageEmbed()
				.setColor(0x6b5cdf)
				.setTitle('Now playing:')
				.setDescription('***S  U  C  C***\n*Requested by <@' + message.author.id + '>*')
			
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