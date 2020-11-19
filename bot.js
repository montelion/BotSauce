/*
BotSauce v4.2.0, the Discord bot for the official Vsauce3 Discord Server
Copyright (C) 2020 Monty#3581

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

The command \randomvideo was suggested by Mathias Thornton#1751. Thanks Mathias!
*/

'use strict';

const version = '4.2.0 - haha guys this is so funny, ***420***'
const releaseDate = '19/11/2020'

const twitchClientID = 'muexic89yevvg6vry4rdlv7byc4656'

const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const client = new Discord.Client();
const guild = new Discord.Guild();
const ytdl = require('ytdl-core');
const express = require("express")
const bodyParser = require("body-parser")
const fetch = require('node-fetch');

require('dotenv').config();

const prefix = '\\'
let botStatus
let statusPrefix
let presenceType

client.login(process.env.BOT_TOKEN);

const swearWords = require('./swearWords.js')
const vsauce3vids = require('./vsauce3vids.js')
const jakeRobotTweets = require('./jakeRobotTweets.js')
const welcomeMessages = require('./welcomeMessages.js')

const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())

// Used for Upptime
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//The IDs for the roles on the Vsauce3 server
const twitchRoleID = '715427352103878679'
const twitterRoleID = '715427437206568970'
const ytRoleID = '715610520341839882'

const logsChannelID = '714618896409428069'

//some stuff for the twitch API
let parsedRefreshTokenBody = ""
let bearerToken = parsedRefreshTokenBody.token || process.env.TWITCH_BEARERTOKEN
const refreshToken = process.env.TWITCH_REFRESHTOKEN
const callbackUrl = process.env.TWITCH_CALLBACKURL
const clientID = process.env.TWITCH_CLIENT_ID


const defaultStatus = '\\help | Watching "Michael Says Prime Numbers for 3 Hours"'



app.listen(port, () => console.log(`The server is now running on port ${port}`))

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));



client.on('ready', () => {

  console.log('If you see this, the bot is running. Hurray! \nIf you close this window, the bot dies \:\('); 

  //The following 3 lines set the bot's default status.
  client.user.setActivity(defaultStatus, { type: 'LISTENING' })
  .then(presence => console.log('Status set to: Listening to ' + defaultStatus))
  .catch(console.error);



  // Defines the channel in which the bot sends the YouTube notification
  const ytChannel = client.channels.cache.get('715610681495519374')

  // Defines the channel in which the bot sends the Twitter notification
  const twitterChannel = client.channels.cache.get('714624387411738664')
  
  // Defines the channel in which the bot sends the Twitch notification
  const twitchChannel = client.channels.cache.get('715428037105287188')

  //A super secret channel
  const complaintsChannel = client.channels.cache.get('738836123190558791')

  //Super secret channel n 2
  const banAppealChannel = client.channels.cache.get('739826940873277491')

  //Used for testing, not on the main server
  const testChannel = client.channels.cache.get('731463300113760316')



  //This code checks if Jake is live through the Twitch API and sends a message in #live accordingly
  
  async function getTwitchToken() {
    return await fetch('https://id.twitch.tv/oauth2/token?client_id=muexic89yevvg6vry4rdlv7byc4656&client_secret=' + process.env.TWITCH_CLIENT_SECRET + '&grant_type=client_credentials', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(async json => {
      let token = json.access_token
      console.log(token)
      return token
    })
  }

  async function getGameName(gameID) {
    console.log('trying to get game')
    return await fetch('https://api.twitch.tv/helix/games?id=' + gameID, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': twitchClientID,
        'Authorization': 'Bearer ' + twitchAccessToken
      }
    })
    .then(res => res.json())
    .then(async gameResponse => {
      let gameName = gameResponse.data[0].name
      console.log('Game name: ' + gameName)
      return gameName
    })
  }

  let twitchAccessToken

  getTwitchToken().then(token => twitchAccessToken = token)

  function twitchTokenToVariable() {getTwitchToken().then(token => twitchAccessToken = token)}
  setInterval(twitchTokenToVariable, 15 * 1000);

  let oldStreamID
    async function isJakeLive() {
     return await fetch('https://api.twitch.tv/helix/streams?user_login=jakeroper', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Client-ID': twitchClientID,
        'Authorization': 'Bearer ' + twitchAccessToken
      }
    })
      .then(res => res.json())
      .then(async json => {
      if (json.data === undefined) return;
      
    console.log('Old stream ID: ' + oldStreamID)
  
      if (json.data[0].id === oldStreamID) return;


        if (json.data[0].type !== 'live') return;

        console.log('idb4gamename: ' + json.data[0].id)

      //console.log('Title: ' + json.data[0].title)
      //console.log('Viewers: ' + json.data[0].viewer_count)
      //console.log('Game: ' + json.data[0].game_id)

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
    
          twitchChannel.send('Hey ' + '<@&' + twitchRoleID + '>' + ', **JakeRoper** is now live on Twitch! Let\'s hang out! \nhttps://twitch.tv/jakeroper', twitchLiveEmbed);
        })

        console.log('aftergameName: ' + json.data[0].id)
      return json.data[0].id
    })
  }


  setInterval(function() {
    isJakeLive().then(streamID => {if (streamID === undefined) return;
      oldStreamID = streamID; console.log('oldStreamID2: ' + streamID)})
  }, 1000);



  app.post("/hook", (req, res) => {

    res.status(200).end()
  
    if (req.body.platform === 'moderation') {
 
      if (req.body.type === 'complaint') {
            
        let embed = new MessageEmbed()
          .setTitle('New complaint')
          .setColor(0x6b5cdf)
          .setDescription('**Username of who the complaint is about** \n' + req.body.about + '\n \n**Username of the person making the complaint**\n' + (req.body.author || '*No username provided*') + '\n \n**Offense**\n' + req.body.offense + '\n \n**Description of offense**\n' + req.body.offenseDescription + '**\n \nEvidence (message links)**\n' + req.body.evidenceLinks + '\n \n**Evidence (screenshots, in case of deleted messages)**\n' + (req.body.evidenceImgs || '*No screenshots provided*'));
        complaintsChannel.send(embed);

      }

      if (req.body.type === 'banAppeal') {
          
        let embed = new MessageEmbed()
          .setTitle('New ban appeal')
          .setColor(0x6b5cdf)
          .setDescription('**What is your username on Discord?** \n' + req.body.username + '\n \n**Why were you banned?**\n' + req.body.banReason + '\n \n**Why do you think you deserve a second chance in the community?**\n' + req.body.secondChance);
        banAppealChannel.send(embed)

      }
    }
  })
});




 

//This is the code that listens for commands and sends the messages
client.on('message', async message => {

  /////////////////
  //             //
  //  Constants  //
  //             //
  /////////////////


  //This mentions the user of the message
  const mentionAuthor = '<@' + message.author.id + '>'

  //This takes the command and splits it in an array, deleting all the spaces (e.g. "\setstatus watching a Vsauce3 video" -> args = ['\setstatus', 'watching', 'a', 'Vsauce3', 'video'])
  const args = message.content.trim().split(/ +/g);

  //This takes the first item from args, it removes the prefix and converts it to lowercase (e.g. '\sETsTatUs' -> 'setstatus')
  const command = args[0].slice(1).toLowerCase();

  //This returns true if the author of the message has a mod/admin role (Taco King, Taco Bell, Taco Prince, Taco Knights, Taco Nobles)
  const checkIfAdmin = message.member.roles.cache.some(role => role.name === 'Taco Knights' || role.name === 'Taco Prince' || role.name === 'Taco Bell' || role.name === 'Taco King')

  //This returns true if the author of the message has an admin role (Taco King, Taco Bell, Taco Prince, Taco Knights)
  const checkIfMod = message.member.roles.cache.some(role => role.name === 'Taco Nobles' || role.name === 'Taco Knights' || role.name === 'Taco Prince' || role.name === 'Taco Bell' || role.name === 'Taco King')


  //////////////////
  //              //
  //  Some stuff  //
  //              //
  //////////////////


  if (message.channel.type === 'news') {

    fetch('https://discord.com/api/v6/channels/' + message.channel.id +'/messages/' + message.id + '/crosspost', {
    method: 'post',
    headers: { 'Authorization': 'Bot ' + process.env.BOT_TOKEN },
    })
  }

    //deletes a message if it contains swear words, and notifies the admins through #logs
  let i
  for (i = 0; i < swearWords.length; i++) {
    if (message.content.toLowerCase().includes(swearWords[i])) {
      embedCommand('Hey!', mentionAuthor + ', that word is not allowed here.')
      const logsChannel = client.channels.cache.get('714618896409428069')
      let embed = new MessageEmbed()
      .setTitle('Message deleted')
      .setColor(0x6b5cdf)
      .setDescription('I deleted a message because it contained a swear word. \n \n**Message** \n' + message.content + '\n \n **Sent by** ' + mentionAuthor);
      logsChannel.send(embed);
      message.delete()
      return;
    }
  }


  if (!message.content.startsWith(prefix)) return;
  
  

  /////////////////
  //             //
  //  Functions  //
  //             //
  /////////////////

  //this function makes an embed
  function embedCommand(commandTitle, commandDescription) {
    let embed = new MessageEmbed()
    .setTitle(commandTitle)
    .setColor(0x6b5cdf)
    .setDescription(commandDescription);
    message.channel.send(embed);
    return
  };

  //This function sets the status of the bot
  function customStatus(statusText, presenceType) {                                                               
    client.user.setActivity(statusText, { type: presenceType })   //The type needs to be either WATCHING, PLAYING, LISTENING OR STREAMING
    .then(presence => console.log('Status set to "' + statusPrefix + botStatus + '" by ' + mentionAuthor))  //this logs to the console (the command prompt window) the new status and the author
    .catch(console.error);
    return
  };


  //This function is used to display the bot status confirmation dialog, and to react to it with a taco emoji and to listen to any reaction from the author of the original message and also to set the status... It's a bunch of functions blended together, really.
  function confirmStatus(wordsToRemove) {
    let i;
    for (i = 0; i < wordsToRemove; i++) {
      args.shift();
    };

  //This empties the botStatus variable. This is useful when the \setstatus command is used multiple times. If this weren't present, the status would be set to the old status followed by the new status
  botStatus = '';

  //This gets all the arguments from args and puts a space before them and saves everything to a variable called botStatus (e.g. args = ['a', 'Vsauce3', 'video'] -> botStatus = ' a Vsauce3 video')
  for (i = 0; i < args.length; i++) {
    botStatus = botStatus + " " + args[i];    
  };                    

  //this makes an embed sending the user the status and asking them to confirm tapping a reaction to the embed.
  let embed = new MessageEmbed()
  .setTitle('Set status?')
  .setColor(0x6b5cdf)
  .setDescription(mentionAuthor + ', to set the status to "' + statusPrefix + botStatus + '" tap 🌮. To set a different one, run **\\setstatus** again. To reset the status to its original state, run **\\resetstatus**');                                          //this sets the content of the message
    message.channel.send(embed).then(sentEmbed => {
      sentEmbed.react("🌮")


      sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '🌮',
      { max: 1, time: 30000 }).then(collected => {
        if (collected.first().emoji.name == '🌮') {
          customStatus(botStatus, presenceType)
          embedCommand('Success!', 'Status set to "' + statusPrefix + botStatus + '" by ' + mentionAuthor)
        }
      });
    })
  }



  async function musicCommands(noVC, file, embedTitle, embedTrack) {
    if (!message.guild) return;
    if (!message.member.voice.channel) {
      message.channel.send(noVC);
    }
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play(file);
      embedCommand(embedTitle, embedTrack + '\n*Requested by ' + mentionAuthor + '*');

      dispatcher.on('finish', () => {
        message.guild.me.voice.channel.leave();
      })
    }
  }


  //If the message comes from a bot the bot ignores the message
  if (message.author.bot) return;

  ////////////////
  //            //
  //  Commands  //
  //            //
  ////////////////

if (command === 'edit') {

      if (message.member.hasPermission('KICK_MEMBERS')) {
      if (!args[3]) {
            embedCommand('Error!', 'You didn\'t provide any arguments, ' + mentionAuthor + '! Usage: **\\edit** *channel ID* *message ID* New message content');
        }
        else {

        client.channels.cache.get(args[1]).messages.fetch(args[2]).then(msg => {
        console.log('Message: ' + msg)

        let newMsg = args.slice(3).join(' ');

      let embed = new MessageEmbed()
        .setTitle('Edit message?')
        .setColor(0x6b5cdf)
        .addFields(
          { name: 'Message URL', value: 'https://discord.com/channels/' + message.guild.id + '/' + args[1] + '/' + args[2] },
        )
        .setDescription(mentionAuthor + ', to confirm, tap 🌮.')
        message.channel.send(embed).then(sentEmbed => {
            sentEmbed.react("🌮")


            sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '🌮',
            { max: 1, time: 30000 }).then(collected => {
                if (collected.first().emoji.name == '🌮') {
                    msg.edit(newMsg);
                    embedCommand('Great!', mentionAuthor + ', here\'s the edited message [here](https://discord.com/channels/' + message.guild.id + '/' + args[1] + '/' + args[2] + ')')
                }
            });
        })
      })
}
    }


    else {
      embedCommand('Oof', 'I\'m sorry ' + mentionAuthor + ', I can\'t let you do that.');   //The user who ran the command doesn't have the right role to run the command
    }
}

if (command === 'send') {

    if (message.member.hasPermission('KICK_MEMBERS')) {
      if (!args[2]) {
            embedCommand('Error!', 'You didn\'t provide any arguments, ' + mentionAuthor + '! Usage: **\\send** *channel ID* Message content');
        }
        else {

        let chnl = client.channels.cache.get(args[1])

       let msg = args.slice(2).join(' ');

      let embed = new MessageEmbed()
        .setTitle('Send message?')
        .setColor(0x6b5cdf)
          .addFields(
         { name: 'Message content', value: msg },
          )
        .setDescription(mentionAuthor + ', to confirm, tap 🌮.')
        message.channel.send(embed).then(sentEmbed => {
            sentEmbed.react("🌮")


            sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '🌮',
            { max: 1, time: 30000 }).then(collected => {
                if (collected.first().emoji.name == '🌮') {
                    chnl.send(msg);
                    embedCommand('Great!', mentionAuthor + ', you sent:\n' +  msg + '\nas the bot')
                }
            });
        })
}
    }


    else {
      embedCommand('Oof', 'I\'m sorry ' + mentionAuthor + ', I can\'t let you do that.');   //The user who ran the command doesn't have the right role to run the command
    }


  }

  if (command === 'help') {
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
      { name: '\\orisit', value: 'Plays "Moon Men" by Jake Chudnow (a.k.a. the Vsauce theme' },
      { name: '\\stop', value: 'Stops playback' }
    )
    message.channel.send(embed);
  }

  if (command === 'caulk') {
    musicCommands('*\'cause I don\'t think you can handle it, you can\'t handle...* ***the caulk*** \nhttps://www.twitch.tv/jakeroper/clip/AbstemiousSlickFiddleheadsKappaRoss', './res/audio/caulk.mp3', 'Now playing:', '*\'cause I don\'t think you can handle it, you can\'t handle...* ***the caulk.***')
  }

  if (command === 'bazinga') {
    musicCommands('***Bazinga*** \nhttps://clips.twitch.tv/BreakableVainRabbitWOOP', './res/audio/bazinga.mp3', 'Now playing:', '***Bazinga***')
  }

  if (command === 'weigh') {

    if (!message.guild) return;
    if (!message.member.voice.channel) {
      message.channel.send('Mmm, very good question. But more importantly... *how much does it weigh?* \nhttps://youtu.be/4OzxNLYJDsE?list=PLiyjwVB09t5zvMrlbSP78hDMfyd_LALA4&t=320');
      embedCommand(' ', 'It weighs ' + (Math.floor(Math.random() * 1000000)) + ' Vsauces')
    }
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play('./res/audio/weigh.mp3');
      embedCommand('What am I playing?', 'Mmm, very good question. But more importantly... *how much does it weigh?*' + '\n*Requested by ' + mentionAuthor + '*');

      dispatcher.on('finish', () => {
        message.guild.me.voice.channel.leave();
        embedCommand(' ', 'It weighs ' + (Math.floor(Math.random() * 1000000)) + ' Vsauces')
      })
    }
  }

  if (command === 'fingers') {
  musicCommands('Hey, Vsauce. Michael here. *Where are your fingers?* \nhttps://youtu.be/L45Q1_psDqk', './res/audio/fingers.mp3', 'Now playing', 'Hey, Vsauce. Michael here. *Where are your fingers?*')
  }

  if (command === 'succ') {
    musicCommands('***S  U  C  C*** \nhttps://clips.twitch.tv/CoyTenuousMosquitoPMSTwin', './res/audio/succ.mp3', 'Now playing:', '***S  U  C  C***')
  }

  if (command === 'orisit') {
    musicCommands('https://youtu.be/TN25ghkfgQA' ,'./res/audio/orisit.mp3', 'Now playing:', '"Moon Men" by Jake Chudnow (a.k.a. the Vsauce theme)')
  }

  if (command === 'social') {
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
    
    message.channel.send(embed)
  }

  if (command === 'info') {
    embedCommand('Bot information', '**Version**: ' + version + ' \n \n**Released on:** ' + releaseDate + ' *(d/m/yyyy)* \n \n[**Changelog**](https://botsauce.github.io/changelog.html) \n \n [**GitHub**](https://github.com/BotSauce/BotSauce) \n \n *Made with love by Monty#3581*');
  }

  if (command === 'randomvideo') {
    message.channel.send('Here\'s your randomly selected Vsauce3 video:\n' + vsauce3vids[Math.floor(Math.random() * vsauce3vids.length)]);
  }

  if (command === 'jakerobot') {
    message.channel.send('Here\'s your AI generated tweet!\n https://twitter.com/jakerawr_but_AI/status/' + jakeRobotTweets[Math.floor(Math.random() * jakeRobotTweets.length)]);
  }

  if (command === 'stop') {
    message.guild.me.voice.channel.leave();
  }

    
  if (command === 'setstatus') {

    if (message.member.hasPermission('KICK_MEMBERS')) {  // returns true if the member has at least one of the roles

      if (!args[1]) {
        return embedCommand('Error!', 'You didn\'t provide any arguments, ' + mentionAuthor + '! You need to type **\\setstatus** followed by the status you want to set.');
      }

      else if (args[1].toLowerCase() === 'watching') {
        statusPrefix = 'Watching'
        presenceType = 'WATCHING';
        confirmStatus(2);
      }

      else if (args[1].toLowerCase() === 'playing') {
        statusPrefix = 'Playing'
        presenceType = 'PLAYING';
        confirmStatus(2);
      }

      else if (args[1].toLowerCase() === 'streaming') {
        statusPrefix = 'Streaming'
        presenceType = 'STREAMING';
        confirmStatus(2);
      }

      else if (args[1].toLowerCase() === 'listening') {
        statusPrefix = 'Listening to'
        presenceType = 'LISTENING';
        confirmStatus(3);
      }

      else {
        embedCommand('Error!', mentionAuthor + ', the status needs to start with *watching*, *playing*, *streaming*, or *listening to*.');
      }
    }   

    else {
      embedCommand('Oof', 'I\'m sorry ' + mentionAuthor + ', I can\'t let you do that.');   //The user who ran the command doesn't have the right role to run the command
    }
  }

  if (command === 'resetstatus') {

    if (message.member.hasPermission('KICK_MEMBERS')) {
      let embed = new MessageEmbed()
        .setTitle('Reset status?')
        .setColor(0x6b5cdf)
        .setDescription(mentionAuthor + ', to reset the status to "Listening to \\help | Watching Michael Says Prime Numbers for 3 Hours" tap 🌮.');
        message.channel.send(embed).then(sentEmbed => {
          sentEmbed.react("🌮")

          sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '🌮',
          { max: 1, time: 30000 }).then(collected => {
            if (collected.first().emoji.name == '🌮') {
              customStatus('\\help | Watching Michael Says Prime Numbers for 3 Hours', 'LISTENING')
              embedCommand('Success!','Status reset to "\\help | Watching Michael Says Prime Numbers for 3 Hours" by ' + mentionAuthor)
            }
          });
        })
      } 

      else {
        embedCommand('Oof', 'I\'m sorry ' + mentionAuthor + ', I can\'t let you do that.');   //The user who ran the command doesn't have the right role to run the comamnd
      }
    }

    if (command === 'ban') {
    
    const userToBan = message.mentions.members.first()

  	if (message.member.hasPermission('BAN_MEMBERS')) {
  		if (!userToBan) {
            embedCommand('Error!', 'You didn\'t mention any user, ' + mentionAuthor + '! Example: **\\ban** *usertoban* reason');
        }

        if(!userToBan.bannable) 
      return embedCommand('Error!', 'I can\'t ban that user');

    let banReason = args.slice(2).join(' ');
    if(!banReason) banReason = "No reason provided";

    	let embed = new MessageEmbed()
        .setTitle('Ban user?')
        .setColor(0x6b5cdf)
        .setDescription('**User:** \n<@' + userToBan + '> \n\n**Reason** ***(visible to the banned user)*** \n' + (banReason || '*No reason provided*') + '\n \n' + mentionAuthor + ', To confirm, tap 🌮');
        message.channel.send(embed).then(sentEmbed => {
            sentEmbed.react("🌮")


            sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id && reaction.emoji.name == '🌮',
            { max: 1, time: 30000 }).then(collected => {
                if (collected.first().emoji.name == '🌮') {
                    embedCommand('Great!', '<@' + userToBan + '> has been banned by ' + mentionAuthor)
  	                userToBan.send('You have been banned from the Vsauce 3 Discord server. \n \n**Reason** \n' + banReason + '\n \n If you\'d like to send a ban appeal, follow this link: \nhttps://botsauce.github.io/banappeal.html')
  	                setTimeout(() => {  userToBan.ban({ reason: banReason }) }, 2000)
                    ;

                }
            });
        })

    }
  }

    if (command === 'modhelp') {

      if (message.member.hasPermission('KICK_MEMBERS')) {

        let embed = new MessageEmbed()
        .setTitle('Commands:')
        .setColor(0x6b5cdf)
        .addFields(
          { name: '\\setstatus', value: 'Sets a custom status for the bot.\n*Usage: \\setstatus followed by the status*', inline: true },
          { name: '\\resetstatus', value: 'Resets the status to its original state (' + defaultStatus + ')', inline: true },
          { name: '\\ban (admin only)', value: 'Bans a user (duh). Usage: **\\ban** *@[user]* *[reason(not mandatory)]* and sends them the complaint form', inline: true },
          { name: '\\send', value: 'Sends a message as the bot. Usage: **\\send** *channel ID* *Message content*', inline: true },
          { name: '\\edit', value: 'Edits a message sent by/as the bot. Usage: **\\edit** *channel ID* *message ID* New message content', inline: true },
        )
        message.channel.send(embed);
      }

      else {
        embedCommand('Oof', 'I\'m sorry ' + mentionAuthor + ', I can\'t let you do that.');   //The user who ran the command doesn't have the right role to run the comamnd
      }
    }
});


client.on('voiceStateUpdate', (oldMember, newMember) => {

  const logsChannel = client.channels.cache.get(logsChannelID)

  let newUserChannel = newMember.channel
  let oldUserChannel = oldMember.channel


  if (oldUserChannel === null && newUserChannel !== null) {

    let embed = new MessageEmbed()
    .setTitle('➡️🔈 Voice channel join')
    .setColor(0x50c850)
    .setDescription('<@' + newMember.member.id + '> joined voice channel 🔈' + newMember.channel.name)
    .setAuthor(newMember.member.user.username + '#' + newMember.member.user.discriminator, newMember.member.user.avatarURL(), '')
    logsChannel.send(embed);

  } else if (newUserChannel === null) {

    let embed = new MessageEmbed()
    .setTitle('🔈➡️ Voice channel leave')
    .setColor(0xff4040)
    .setDescription('<@' + oldMember.member.id + '> left voice channel 🔈' + oldMember.channel.name)
    .setAuthor(oldMember.member.user.username + '#' + oldMember.member.user.discriminator, oldMember.member.user.avatarURL(), '')
    logsChannel.send(embed);

  }

})



client.on("guildMemberUpdate", (oldMember, newMember) => {

  const logsChannel = client.channels.cache.get(logsChannelID)

  if (oldMember.nickname === newMember.nickname) return;

  function getOldNickname() {

    if (oldMember.nickname === null) {
      return oldMember.user.username;
    }
    else {
      return oldMember.nickname;
    }

  }

  function getNewNickname() {

    if (newMember.nickname === null) {
      return newMember.user.username;
    }
    else {
      return newMember.nickname;
    }

  }

  let embed = new MessageEmbed()
  .setTitle('✏️ Nickname edited')
  .setColor(0xfcba03)
  .setDescription('<@' + newMember.id + '> nickname edited.')
  .setAuthor(oldMember.user.username + '#' + oldMember.user.discriminator, oldMember.user.avatarURL(), '')
  .setThumbnail(oldMember.user.avatarURL())
  .addFields(
    { name: 'Old nickname', value: getOldNickname(), inline: true },
    { name: 'New nickname', value: getNewNickname(), inline: true },
  )
  logsChannel.send(embed);
});




client.on("messageDelete", message => {

  console.log(message.attachments.array()[0])

  const logsChannel = client.channels.cache.get(logsChannelID)

  if (message.author.id === client.user.id) return;
  if (message.channel === client.channels.cache.get('727676446897864705')) return;
  if (message.author.bot) return;

  if (!message.attachments.array()[0]) {
    let embed = new MessageEmbed()
    .setTitle('🗑️ Message deleted')
    .setColor(0xff4040)
    .setDescription('Message sent by <@' + message.author + '> deleted in <#' + message.channel + '>')
    .addFields(
      { name: 'Deleted message', value: message.content},
    )
    .setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL(), '')
   logsChannel.send(embed);
  }
  else {

    function atchNum() {
      if (message.attachments.array().length === 1) {
        return (message.attachments.array().length + ' attachment')
      } else {
        return (message.attachments.array().length + ' attachments')
      }
    }

    let embed = new MessageEmbed()
    .setTitle('🗑️ Message deleted')
    .setColor(0xff4040)
    .setDescription('Message sent by <@' + message.author + '> deleted in <#' + message.channel + '>')
    .addFields(
      { name: 'Deleted message', value: (message.content || '*The body of the message was empty.*') },
      { name: 'Attachments', value: '*The message contained ' + atchNum() + '.*' }
    )
    .setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL(), '')
   logsChannel.send(embed); 
  }

});



client.on("messageUpdate", (oldMessage, newMessage) => {

  const logsChannel = client.channels.cache.get(logsChannelID)
  if (newMessage.author.bot) return;
  if (newMessage.author.id === client.user.id) return;
  if (oldMessage.content === newMessage.content) return;
  if (newMessage.channel === client.channels.cache.get('727676446897864705')) return;

  let embed = new MessageEmbed()
  .setTitle('✏️ Message edited')
  .setColor(0xfcba03)
  .setDescription('[Message](' + newMessage.url + ') edited by <@' + newMessage.author + '> in <#' + newMessage.channel + '>')
  .addFields(
        { name: 'Old message', value: oldMessage.content },
        { name: 'New message', value: newMessage.content },
   )
  .setAuthor(newMessage.author.username + '#' + newMessage.author.discriminator, newMessage.author.avatarURL(), '')
  logsChannel.send(embed);

});



client.on("guildMemberAdd", member => {

    const arrivalsChannel = client.channels.cache.get('714538264157093948')
    
    arrivalsChannel.send(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)].replace("{user}", '**' + member.user.username + '#' + member.user.discriminator + '**'))
});

client.on("guildMemberRemove", member => {

  const logsChannel = client.channels.cache.get(logsChannelID)

  let embed = new MessageEmbed()
  .setColor(0xff4040)
  .setDescription('📤 <@' + member.id + '> left the server.')
  .setAuthor(member.user.username + '#' + member.user.discriminator, member.user.avatarURL(), '')
  .setThumbnail(member.user.avatarURL())
  logsChannel.send(embed);

});

