const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = class WeighCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'weigh',
			aliases: ['howmuchdoesitweigh'],
			group: 'main',
			memberName: 'weigh',
			description: 'What does this command do? *Mmm, very good question. But more importantly... how much does it weigh?*',
		});
	}

	run(message) {
		async function music() {
			if (!message.guild) return;
			if (!message.member.voice.channel) {
				return message.say('Mmm, very good question. But more importantly... *how much does it weigh?* \nhttps://youtu.be/4OzxNLYJDsE?list=PLiyjwVB09t5zvMrlbSP78hDMfyd_LALA4&t=320');
			}

			if (message.member.voice.channel) {
				const connection = await message.member.voice.channel.join();
				const dispatcher = connection.play(fs.createReadStream('./commands/main/res/audio/weigh.mp3'));
				
				let embed = new MessageEmbed()
				.setColor(0x6b5cdf)
				.setTitle('Now playing:')
				.setDescription('Mmm, very good question. But more importantly... *how much does it weigh?*\n*Requested by <@' + message.author.id + '>*')
			
					dispatcher.on('finish', () => {
					message.guild.me.voice.channel.leave();

					dispatcher.on('error', console.error);
				})
				return message.embed(embed).then( () => message.say('It weighs ' + (Math.floor(Math.random() * 69420)) + ' Vsauces'))
				
			}
		}
		return music()
	}
};