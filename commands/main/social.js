const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class SocialCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'social',
			aliases: ['links'],
			group: 'main',
			memberName: 'social',
			description: 'Jake’s social media accounts',
		});
	}

	run(message) {
		let embed = new MessageEmbed()
		.setColor(0x6b5cdf)
		.setTitle('Social media accounts')
		.addFields(
			{ name: 'Youtube', value: '[Jake Roper](https://www.youtube.com/jakerawr) \n[Vsauce3](https://www.youtube.com/user/Vsauce3)' },
			{ name: 'Twitch', value: '[JakeRoper](https://twitch.tv/jakeroper)' },
			{ name: 'Twitter', value: '[Jake Roper](https://twitter.com/jakerawr) \n[Vsauce3](https://twitter.com/vsaucethree)' },
			{ name: 'Instagram', value: '[Jake Roper (Vsauce3)](https://instagram.com/jakerawr)' },
			{ name: 'Facebook', value: '[Jake Roper](https://facebook.com/jakerawr) \n[Vsauce3](https://www.facebook.com/Vsauce3)' },
		)
	return message.embed(embed);
	}
};