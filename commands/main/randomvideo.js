const { Command } = require('discord.js-commando');
const vs3vids = require('./res/arrays/vs3vids.js')

module.exports = class RandomVideoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'randomvideo',
			aliases: ['random', 'video', 'random-video'],
			group: 'main',
			memberName: 'randomvideo',
			description: 'Links to a randomly selected Vsauce3 video',
		});
	}

	run(message) {
		return message.say('Here\'s your randomly selected Vsauce3 video:\n' + vs3vids[Math.floor(Math.random() * vs3vids.length)]);
	}
};