/*
	BotSauce v5.0.0, the Discord bot for the official Vsauce3 Discord Server.
	Copyright (C) 2020-2021 Monty#3581

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.    See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.    If not, see <https://www.gnu.org/licenses/>.
*/

const Commando = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const path = require('path')
const fs = require('fs')
const https = require('https');
require('dotenv').config()
const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require("body-parser")
const app = express()
app.use(bodyParser.json({
	verify: (req, res, buf) => {
		req.rawBody = buf
	}
}))
const crypto = require('crypto');
const botConfig = require('./res/config.json');
const swearWords = require('./res/swearWords.js');
const welcomeMessages = require('./res/welcomeMessages.js');

var key = fs.readFileSync('./res/privkey.pem');
var cert = fs.readFileSync('./res/fullchain.pem');
var options = {
	key: key,
	cert: cert
};

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/res/index.html');
});

app.get('/success', (req, res) => {
	res.sendFile(__dirname + '/res/success.html');
});

app.get('/status', (req, res) => {
	res.redirect('https://botsauce.github.io/status/');
});

var server = https.createServer(options, app);

server.listen(443)

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));


// Commands

let client = new Commando.Client({
	commandPrefix: '\\',
	owner: '406125028065804289',
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['main', 'Main commands'],
		['staff', 'Staff commands'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		help: false,
		unknownCommand: false,
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('message', async message => {
	if (message.channel.parentID !== botConfig.staffCategory) {
		for (let i = 0; i < swearWords.length; i++) {
			if (message.content.toLowerCase().includes(swearWords[i])) {

				let bad = new MessageEmbed()
					.setTitle('Hey!')
					.setColor(0x6b5cdf)
					.setDescription(`<@${message.author.id}>, that word is not allowed here.`)

				message.channel.send(bad)

				const logsChannel = client.channels.cache.get(botConfig.logs)
				let logsEmbed = new MessageEmbed()
					.setTitle('Message deleted')
					.setColor(0x6b5cdf)
					.setDescription('I deleted a message because it contained a swear word.')
					.addFields(
						{ name: 'Message', value: message.content },
						{ name: 'First match', value: swearWords[i] },
						{ name: 'Sent by', value: `<@${message.author.id}>` },
					)

				logsChannel.send(logsEmbed);
				message.delete()
				return;
			}
		}
	}
})

const sqlite = require('sqlite');

client.setProvider(
	sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.on('error', console.error);


// Discord logging

client.on('voiceStateUpdate', (oldMember, newMember) => {

	const logsChannel = client.channels.cache.get(botConfig.logs)

	if (oldMember.channel === null && newMember.channel !== null) {

		let embed = new MessageEmbed()
			.setTitle('➡️🔈 Voice channel join')
			.setColor(0x50c850)
			.setDescription(`<@${newMember.member.id}> joined voice channel 🔈 ${newMember.channel.name}`)
			.setAuthor(newMember.member.user.username + '#' + newMember.member.user.discriminator, newMember.member.user.avatarURL(), '')
		logsChannel.send(embed);

	} else if (newMember.channel === null) {

		let embed = new MessageEmbed()
			.setTitle('🔈➡️ Voice channel leave')
			.setColor(0xff4040)
			.setDescription(`<@${oldMember.member.id}> left voice channel 🔈 ${oldMember.channel.name}`)
			.setAuthor(oldMember.member.user.username + '#' + oldMember.member.user.discriminator, oldMember.member.user.avatarURL(), '')
		logsChannel.send(embed);

	}

})

client.on("guildMemberUpdate", (oldMember, newMember) => {

	const logsChannel = client.channels.cache.get(botConfig.logs)

	if (oldMember.nickname === newMember.nickname) return;
	function getOldNickname() {
		if (oldMember.nickname === null) {
			return oldMember.user.username;
		} else {
			return oldMember.nickname;
		}
	}

	function getNewNickname() {
		if (newMember.nickname === null) {
			return newMember.user.username
		} else {
			return newMember.nickname
		}
	}

	let embed = new MessageEmbed()
		.setTitle('✏️ Nickname edited')
		.setColor(0xfcba03)
		.setDescription(`<@${newMember.id}> edited their nickname.`)
		.setAuthor(oldMember.user.username + '#' + oldMember.user.discriminator, oldMember.user.avatarURL(), '')
		.setThumbnail(oldMember.user.avatarURL())
		.addFields(
			{ name: 'Old nickname', value: getOldNickname(), inline: true },
			{ name: 'New nickname', value: getNewNickname(), inline: true },
		)
	logsChannel.send(embed);
});

client.on("messageDelete", message => {

	const logsChannel = client.channels.cache.get(botConfig.logs)

	if (message.author.id === client.user.id) return;
	if (message.channel === client.channels.cache.get('727676446897864705')) return; //I honestly have no clue what this does, but I sure as heck am not gonna remove this.
	if (message.author.bot) return;

	if (!message.attachments.array()[0]) {
		let embed = new MessageEmbed()
			.setTitle('🗑️ Message deleted')
			.setColor(0xff4040)
			.setDescription(`Message sent by ${message.author} deleted in ${message.channel}`)
			.addFields(
				{ name: 'Deleted message', value: message.content },
			)
			.setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL(), '')
		logsChannel.send(embed);
	} else {
		atchNum(() => {
			if (message.attachments.array().length === 1) {
				return ('1 attachment')
			} else {
				return (message.attachments.array().length + ' attachments')
			}
		})

		let embed = new MessageEmbed()
			.setTitle('🗑️ Message deleted')
			.setColor(0xff4040)
			.setDescription(`Message sent by ${message.author} deleted in ${message.channel}`)
			.addFields(
				{ name: 'Deleted message', value: (message.content || '*The body of the message was empty.*') },
				{ name: 'Attachments', value: '*The message contained ' + atchNum() + '.*' }
			)
			.setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL(), '')
		logsChannel.send(embed);
	}
});

client.on("messageUpdate", (oldMessage, newMessage) => {

	const logsChannel = client.channels.cache.get(botConfig.logs)
	if (newMessage.author.bot) return;
	if (newMessage.author.id === client.user.id) return;
	if (oldMessage.content === newMessage.content) return;
	if (newMessage.channel === client.channels.cache.get('727676446897864705')) return; //h

	let embed = new MessageEmbed()
		.setTitle('✏️ Message edited')
		.setColor(0xfcba03)
		.setDescription(`[Message](${newMessage.url}) edited by ${newMessage.author} in ${newMessage.channel}`)
		.addFields(
			{ name: 'Old message', value: oldMessage.content },
			{ name: 'New message', value: newMessage.content },
		)
		.setAuthor(newMessage.author.username + '#' + newMessage.author.discriminator, newMessage.author.avatarURL(), '')
	logsChannel.send(embed);
});

client.on("guildMemberAdd", member => {

	const arrivalsChannel = client.channels.cache.get(botConfig.arrivals)
	arrivalsChannel.send(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)].replace("{user}", `**${member.user.username}#${member.user.discriminator}**`))
});

client.on("guildMemberRemove", member => {
	const logsChannel = client.channels.cache.get(botConfig.logs)
	let embed = new MessageEmbed()
		.setColor(0xff4040)
		.setDescription(`📤 <@${member.id}> left the server.`)
		.setAuthor(member.user.username + '#' + member.user.discriminator, member.user.avatarURL(), '')
		.setThumbnail(member.user.avatarURL())
	logsChannel.send(embed);
});

app.post("/moderation", (req, res) => {

	res.status(200).end()

	if (req.body.type === 'complaint') {

		let embed = new MessageEmbed()
			.setTitle('New complaint')
			.setColor(0x6b5cdf)
			.addFields(
				{ name: 'Username of who the complaint is about', value: req.body.about },
				{ name: 'Username of the person making the complaint', value: (req.body.author || '*No username provided*') },
				{ name: 'Offense', value: req.body.offense },
				{ name: 'Description of offense', value: req.body.offenseDescription },
				{ name: 'Evidence (message links)', value: req.body.evidenceLinks },
				{ name: 'Evidence (screenshots, in case of deleted messages)', value: (req.body.evidenceImgs || '*No screenshots provided*') }
			)

		client.channels.cache.get(botConfig.complaint).send(embed);
	}

	if (req.body.type === 'banAppeal') {

		let embed = new MessageEmbed()
			.setTitle('New ban appeal')
			.setColor(0x6b5cdf)
			.addFields(
				{ name: 'What is your username on Discord?', value: req.body.username },
				{ name: 'Why were you banned?', value: req.body.banReason },
				{ name: 'Why do you think you deserve a second chance in the community?', value: req.body.secondChance },
			)

		client.channels.cache.get(botConfig.banAppeal).send(embed);
	}

})


// Twitch stuff

async function getTwitchToken() {
	return await fetch('https://id.twitch.tv/oauth2/token?client_id=muexic89yevvg6vry4rdlv7byc4656&client_secret=' + process.env.TWITCH_CLIENT_SECRET + '&grant_type=client_credentials', { method: 'post' })
		.then(res => res.json())
		.then(async json => { return json.access_token })
}

getTwitchToken().then(twitchToken => {

	//unsubscribe from every old sub
	fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			'Client-ID': 'muexic89yevvg6vry4rdlv7byc4656',
			'Authorization': 'Bearer ' + twitchToken,
		},
	})
		.then(res => res.json())
		.then(json => {
			for (i = 0; i < json.data.length; i++) {
				fetch('https://api.twitch.tv/helix/eventsub/subscriptions?id=' + json.data[i].id, {
					method: 'delete',
					headers: {
						'Content-Type': 'application/json',
						'Client-ID': 'muexic89yevvg6vry4rdlv7byc4656',
						'Authorization': 'Bearer ' + twitchToken,
					},
				})
			}
		});

	//subscribe
	const twitchSubConfig = {
		"type": "stream.online",
		"version": "1",
		"condition": {
			"broadcaster_user_id": "59125907"
		},
		"transport": {
			"method": "webhook",
			"callback": "https://botsauce.cf/twitch",
			"secret": process.env.TWITCH_SHA_KEY
		}
	};

	fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
		method: 'post',
		body: JSON.stringify(twitchSubConfig),
		headers: {
			'Content-Type': 'application/json',
			'Client-ID': 'muexic89yevvg6vry4rdlv7byc4656',
			'Authorization': 'Bearer ' + twitchToken,
		},
	})
		.then(res => res.json())
		.then(json => console.log(json));
})

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('\\help | Watching "Michael Says Prime Numbers for 3 Hours"', { type: 'LISTENING' })

	app.post('/twitch', (req, res) => {

		function HMAC_SHA256(stringToHash) {
			const twitchSHAKey = process.env.TWITCH_SHA_KEY;
			const twitchHash = crypto.createHmac('sha256', twitchSHAKey).update(stringToHash);
			return twitchHash.digest('hex');
		}

		function twitchVerifySignature() {
			return ('sha256=' + HMAC_SHA256(req.header('Twitch-Eventsub-Message-Id') + req.header('Twitch-Eventsub-Message-Timestamp') + req.rawBody)) === req.header('Twitch-Eventsub-Message-Signature')
		}

		getTwitchToken().then(twitchToken => {
			async function getGameName(gameID) {
				return await fetch('https://api.twitch.tv/helix/games?id=' + gameID, {
					method: 'get',
					headers: {
						'Content-Type': 'application/json',
						'Client-ID': 'muexic89yevvg6vry4rdlv7byc4656',
						'Authorization': 'Bearer ' + twitchToken
					}
				})
					.then(res => res.json())
					.then(gameResponse => {
						let gameName = gameResponse.data[0].name
						return gameName
					})
			}

			let prevNotifID

			if (!twitchVerifySignature()) {
				res.status(403).send()
				console.log('Wrong signature')
				console.log(req)
			}

			else if (req.body.subscription.status === 'webhook_callback_verification_pending') {
				res.status(200).send(req.body.challenge)
				console.log('Subscribed successfully')
				console.log(req.body)
			}

			else if (req.body.event.type === 'live') {

				if (req.header('Twitch-Eventsub-Message-Id') === prevNotifID) return console.log('|return|: SAME_ID');
				prevNotifID = req.header('Twitch-Eventsub-Message-Id')

				res.status(200).send()
				console.log(req.body)

				do {
					fetch('https://api.twitch.tv/helix/streams?user_login=jakeroper', {
						method: 'get',
						headers: {
							'Content-Type': 'application/json',
							'Client-ID': 'muexic89yevvg6vry4rdlv7byc4656',
							'Authorization': 'Bearer ' + twitchToken
						}
					}).then(res => res.json()).then(json => {

						if (json.data !== undefined) {

							getGameName(json.data[0].game_id).then(gameName => {

								let twitchLiveEmbed = new MessageEmbed()
									.setColor(0x6b5cdf)
									.setTitle(json.data[0].title)
									.setURL('https://twitch.tv/jakeroper')
									.setImage(json.data[0].thumbnail_url.replace("{width}", "320").replace("{height}", "180"))
									.setAuthor('JakeRoper', 'https://static-cdn.jtvnw.net/jtv_user_pictures/jakeroper-profile_image-1bcf7b0eda6d5b90-300x300.jpeg', 'https://twitch.tv/jakeroper')
									.setThumbnail('https://static-cdn.jtvnw.net/jtv_user_pictures/jakeroper-profile_image-1bcf7b0eda6d5b90-300x300.jpeg')
									.addFields(
										{ name: 'Game', value: gameName, inline: true },
										{ name: 'Viewers', value: json.data[0].viewer_count, inline: true },
									)

								client.channels.cache.get(botConfig.twitch).send('Hey ' + '<@&' + botConfig.twitchRole + '>' + ', **JakeRoper** is now live on Twitch! Let\'s hang out! \nhttps://twitch.tv/jakeroper', twitchLiveEmbed);
							})
						}
					})
				} while (json.data === undefined)
			}
		})
	})
})

client.login(process.env.BOT_TOKEN);