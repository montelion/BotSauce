const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class FingersCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fingers',
			aliases: ['heyvsaucemichaelhere', 'heyvsauce', 'michaelhere'],
			group: 'main',
			memberName: 'fingers',
			description: 'Hey, Vsauce. Michael here. *Where are your fingers?*',
		});
	}

	run(message) {
		async function music() {
			if (!message.guild) return;
			if (!message.member.voice.channel) {
				return message.say('Hey, Vsauce. Michael here. *Where are your fingers?* \nhttps://youtu.be/L45Q1_psDqk');
			}

			if (message.member.voice.channel) {
				const connection = await message.member.voice.channel.join();
				const dispatcher = connection.play(fs.createReadStream('./commands/main/res/audio/fingers.mp3'));
				
				let embed = new MessageEmbed()
				.setColor(0x6b5cdf)
				.setTitle('Now playing:')
				.setDescription('Hey, Vsauce. Michael here. *Where are your fingers?*\n*Requested by <@' + message.author.id + '>*')
			
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