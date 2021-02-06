const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class CaulkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'caulk',
			aliases: ['canthandleit'],
			group: 'main',
			memberName: 'caulk',
			description: '\'cause I don\'t think you can handle it. You can\'t handle...* this command',
		});
	}

	run(message) {
		async function music() {
			if (!message.guild) return;
			if (!message.member.voice.channel) {
				return message.say('*\'cause I don\'t think you can handle it, you can\'t handle...* ***the caulk*** \nhttps://www.twitch.tv/jakeroper/clip/AbstemiousSlickFiddleheadsKappaRoss');
			}

			if (message.member.voice.channel) {
				const connection = await message.member.voice.channel.join();
				const dispatcher = connection.play(fs.createReadStream('./commands/main/res/audio/caulk.mp3'));
				
				let embed = new MessageEmbed()
				.setColor(0x6b5cdf)
				.setTitle('Now playing:')
				.setDescription('*\'cause I don\'t think you can handle it, you can\'t handle...* ***the caulk.***\n*Requested by <@' + message.author.id + '>*')
			
					dispatcher.on('finish', () => {
					message.guild.me.voice.channel.leave();

					dispatcher.on('error', console.error);

					return message.embed(embed)
				})
			}
		}
		return music()
	}
};