/*
BotSauce v3.5, the Discord bot for the official Vsauce3 Discord Server
Copyright (C) 2020 Montelion#3581

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

const version = '3.5'
const releaseDate = '12/8/2020'

const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const client = new Discord.Client();
const guild = new Discord.Guild();
const ytdl = require('ytdl-core');

require('dotenv').config();

const prefix = '\\'
let botStatus
let statusPrefix
let presenceType

client.login(process.env.BOT_TOKEN);

const swearWords = require('./swearWords.js')
const vsauce3vids = require('./vsauce3vids.js')
const jakeRobotTweets = require('./jakeRobotTweets.js')

const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())


//The IDs for the roles on the Vsauce3 server
const twitchRoleID = '715427352103878679'
const twitterRoleID = '715427437206568970'
const ytRoleID = '715610520341839882'


app.listen(port, () => console.log(`The server is now running on port ${port}`))



process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));



client.on('ready', () => {

  //The following line appears in the Command Prompt window
  console.log('If you see this, the bot is running. Hurray! \nIf you close this window, the bot dies \:\('); 

  //The following 3 lines set the bot's default status.
  client.user.setActivity('\\help | Watching Michael Says Prime Numbers for 3 Hours', { type: 'LISTENING' })  //The type needs to be either WATCHING, PLAYING, LISTENING OR STREAMING
  .then(presence => console.log('Status set to "Listening to \\help | Watching Michael Says Prime Numbers for 3 Hours"'))  //                                           ^(to)
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




  app.post("/hook", (req, res) => {

    //this checks if the key in the request matches the one in the .env file. If it doesn't, it logs to the console a warning. If it does, it runs the other code.
    if (req.body.key !== process.env.REQUEST_KEY) {
      console.log('Someone tried to send a POST request with the key ' + req.body.key + '\n The key did not match the one in the .env file, so the request was ignored.')
      res.status(200).end() // Answers to the webhook with OK
    }

    else {
      
      if (req.body.platform === 'twitch') {
        twitchChannel.send('Hey ' + '<@&' + twitchRoleID + '>' + ', JakeRoper is now live on https://www.twitch.tv/jakeroper ! LET\'S HANG OUT!');
      }

  
      if (req.body.platform === 'twitter') {
        twitterChannel.send('Hey ' + '<@&' + twitterRoleID + '>' + ', **' + req.body.username + '** just posted a new tweet! \n' + req.body.link);
      }

      if (req.body.platform === 'youtube') {
        ytChannel.send('Hey ' + '<@&' + ytRoleID + '>'+ ', ' + req.body.channel + ' has just uploaded ' + req.body.video + '! \n' + req.body.link);
      }

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


      //used for testing
      if (req.body.platform === 'test') {
        testChannel.send(req.body.text)
      }

    

      res.status(200).end() // Answers to the webhook with OK
    }

  })

});





client.on("guildMemberAdd", member => {

    const arrivalsChannel = client.channels.cache.get('714538264157093948')

    console.log('it successfully found the channel')
    arrivalsChannel.send('Welcome, **' + member.user.username + '#' + member.user.discriminator + '**! Can you handle the caulk?')

});

 

//This is the code that listens for commands and sends the messages
client.on('message', async message => {

  if (!message.content.startsWith(prefix)) return;
  
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






  //If the message comes from a bot the bot ignores the message
  if (message.author.bot) return;

  ////////////////
  //            //
  //  Commands  //
  //            //
  ////////////////

  if (command === 'test') {
    console.log('placeholder for command')
  }

  if (command === 'ban') {

  	const userToBan = message.mentions.members.first()

  	if (checkIfAdmin) {  // returns true if the member has at least one of the roles
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
  	                userToBan.send('You have been banned from the Vsauce 3 Discord server. \n \n**Reason** \n' + banReason + '\n \n If you\'d like to send a ban appeal, follow this link: \nhttps://docs.google.com/forms/d/e/1FAIpQLSf2MK_S_0G2B1PhmAq9ieF40S-7TJ1SOCrSBik4ByUr1PoDhA/viewform?usp=sf_link')
  	                setTimeout(() => {  userToBan.ban(banReason) }, 2000)
                    ;
  	    	       
                }
            });
        })

      }


    else {
      embedCommand('Oof', 'I\'m sorry ' + mentionAuthor + ', I can\'t let you do that.');   //The user who ran the command doesn't have the right role to run the command
    }

  }

  if (command === 'help') {
    embedCommand('Commands:', '**\\twitch** \nLinks to Jake\'s Twitch account \n \n**\\youtube** \nLinks to Jake\'s YouTube channels \n \n **\\twitter** \nLinks to Jake\'s Twitter accounts \n \n**\\randomvideo** \nLinks to a randomly selected Vsauce3 video \n \n**\\caulk** \n*\'cause I don\'t think you can handle it. You can\'t handle...* this command \n \n**\\weigh** \nWhat does this command do? *Mmm, very good question. But more importantly... how much does it weigh?* \n \n **\\fingers**\nHey, Vsauce. Michael here. *Where are your fingers?* \n \n **\\succ**\n***S  U  C  C*** \n \n **\\bazinga** \n ***B A Z I N G A*** \n \n **\\stop** \n *Stops whatever the bot is playing in VC* \n \n **\\jakerobot**\nLinks to AI-generated tweets made using tweets by @jakerawr \n \n **\\orisit** \nPlays "Moon Men" by Jake Chudnow (a.k.a. the Vsauce theme)')
  }

  if (command === 'caulk') {
    musicCommands('*\'cause I don\'t think you can handle it, you can\'t handle...* ***the caulk*** \nhttps://www.twitch.tv/jakeroper/clip/AbstemiousSlickFiddleheadsKappaRoss', './audioclips/caulk.mp3', 'Now playing:', '*\'cause I don\'t think you can handle it, you can\'t handle...* ***the caulk.***')
  }

  if (command === 'bazinga') {
    musicCommands('***Bazinga*** \nhttps://clips.twitch.tv/BreakableVainRabbitWOOP', './audioclips/bazinga.mp3', 'Now playing:', '***Bazinga***')
  }

  if (command === 'weigh') {

    if (!message.guild) return;
    if (!message.member.voice.channel) {
      message.channel.send('Mmm, very good question. But more importantly... *how much does it weigh?* \nhttps://youtu.be/4OzxNLYJDsE?list=PLiyjwVB09t5zvMrlbSP78hDMfyd_LALA4&t=320');
      embedCommand(' ', 'It weighs ' + (Math.floor(Math.random() * 1000000)) + ' Vsauces')
    }
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play('./audioclips/weigh.mp3');
      embedCommand('What am I playing?', 'Mmm, very good question. But more importantly... *how much does it weigh?*' + '\n*Requested by ' + mentionAuthor + '*');

      dispatcher.on('finish', () => {
        message.guild.me.voice.channel.leave();
        embedCommand(' ', 'It weighs ' + (Math.floor(Math.random() * 1000000)) + ' Vsauces')
      })
    }
  }

  if (command === 'fingers') {
  musicCommands('Hey, Vsauce. Michael here. *Where are your fingers?* \nhttps://youtu.be/L45Q1_psDqk', './audioclips/fingers.mp3', 'Now playing', 'Hey, Vsauce. Michael here. *Where are your fingers?*')
  }

  if (command === 'succ') {
    musicCommands('***S  U  C  C*** \nhttps://clips.twitch.tv/CoyTenuousMosquitoPMSTwin', './audioclips/succ.mp3', 'Now playing:', '***S  U  C  C***')
  }

  if (command === 'orisit') {
    musicCommands('https://youtu.be/TN25ghkfgQA' ,'./audioclips/orisit.mp3', 'Now playing:', '"Moon Men" by Jake Chudnow (a.k.a. the Vsauce theme)')
  }

  if (command === 'twitch') {
    embedCommand('Twitch', 'https://www.twitch.tv/jakeroper');
  }

  if (command === 'youtube') {
    embedCommand('YouTube', '**Vsauce3**: \nhttps://youtube.com/vsauce3 \n \n**Jake Roper**: \nhttps://youtube.com/jakerawr');
  }

  if (command === 'twitter') {
    embedCommand('Twitter', '**Vsauce3**: \nhttps://www.twitter.com/vsaucethree \n \n**Jake Roper**: \nhttps://www.twitter.com/jakerawr');
  }

  if (command === 'info') {
    embedCommand('Bot information', '**Version**: ' + version + ' \n \n**Released on:** ' + releaseDate + ' *(d/m/yyyy)* \n \n**Changelog:** https://montelion.gitbook.io/botsauce/changelog \n \n **Source code:** https://github.com/Montelion/BotSauce \n \n *Made with love by Monty#3581*');
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

    if (checkIfMod) {  // returns true if the member has at least one of the roles

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

  /*THE COMMAND \CONFIRMSTATUS HAS BEEN DEPRECATED IN FAVOR OF A REACTION BASED CONFIRMATION (v2.2). For this reason it has been commented out.

  if (command === 'confirmstatus') {

    if (checkIfMod) {  // returns true if the member has at least one of the roles
      customStatus(botStatus, presenceType)
      embedCommand('Success!', 'Status set to "' + statusPrefix + botStatus + '" by ' + mentionAuthor)
    }

    else {
      embedCommand('Oof', 'I\'m sorry ' + mentionAuthor + ', I can\'t let you do that.');   //The user who ran the command doesn't have the right role to run the command
    }
  }
  */

  if (command === 'resetstatus') {

    if (checkIfMod) {
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

    if (command === 'modhelp') {

    if (checkIfMod) {
      embedCommand('Mod commands:', '**\\setstatus** \nSets a custom status for the bot.\n*Usage: \\setstatus followed by the status you want to set.* \n \n**\\resetstatus** \nResets the status to its original state. \n \n**\\info**: Shows the bot\'s version, release date, and changelog.')
    }

    else {
      embedCommand('Oof', 'I\'m sorry ' + mentionAuthor + ', I can\'t let you do that.');   //The user who ran the command doesn't have the right role to run the comamnd
    }
  }

});
