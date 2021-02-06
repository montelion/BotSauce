const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class infoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			group: 'staff',
			aliases: ['botinfo', 'version', 'sourcecode', 'code', 'release'],
			memberName: 'info',
			description: 'Displays information about the bot.',
		});
	}

	run(message) {
        let embed = new MessageEmbed()
        .setTitle('Info')
        .setURL('https://botsauce.github.io/changelog')
        .setColor(0x6b5cdf)
        .addFields(
            { name: 'Version', value: '5.0.0', inline: true },
            { name: 'Release date', value: '24/12/2020', inline: true },
            { name: 'GitHub', value: '[Source code](https://github.com/BotSauce/BotSauce) '},
            { name: 'Changelog', value: '[Changelog](https://botsauce.github.io/changelog), [Releases](https://github.com/BotSauce/BotSauce/releases) '},
        )
        .setFooter('Made with love by Monty#3581')

        return message.embed(embed)
	}
};