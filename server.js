/*
BotSauce v3.1.0, the Discord bot for the official Vsauce3 Discord Server
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
const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const client = new Discord.Client();
const guild = new Discord.Guild();
const ytdl = require('ytdl-core');

const prefix = '\\'
let botStatus
let statusPrefix
let presenceType


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



//Put your bot token in place of 'your bot token here'
const botToken = 'NzMxMDg3Nzg4ODI4Nzg2Njg5.XwnnRA.GUk9NAHx1aQCgyv70MAbKxn2QvM'



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


  app.post("/hook", (req, res) => {


  if (req.body.platform === 'twitch') {
    twitchChannel.send('Hey ' + '<@&' + twitchRoleID + '>' + ', JakeRoper is now live on https://www.twitch.tv/jakeroper​ ! LET\'S HANG OUT!');
  }


  if (req.body.platform === 'twitter') {
    twitterChannel.send('Hey ' + '<@&' + twitterRoleID + '>' + ', **jakerawr** just posted a new tweet! \n' + req.body.link);
  }


  if (req.body.platform === 'youtube') {
    ytChannel.send('Hey ' + '<@&' + ytRoleID + '>'+ ', ' + req.body.channel + ' has just uploaded ' + req.body.video + '! \n' + req.body.link);
  }
    

  res.status(200).end() // Answers to the webhook with OK

  })

});





client.on("guildMemberAdd", member => {

    const arrivalsChannel = client.channels.cache.get('714538264157093948')

    console.log('it successfully found the channel')
    arrivalsChannel.send(`Welcome, ${member.user}! Can you handle the caulk?`)

});

 

//This is the code that listens for commands and sends the messages
client.on('message', async message => {

  //If the message doesn't start with the prefix (\) the bot ignores the message
  if (!message.content.startsWith(prefix)) return;

  //If the message comes from a bot the bot ignores the message
  if (message.author.bot) return;


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

  //This returns true if the author of the message has a mod/admin role (Taco King, Taco Prince, Taco Knights, Taco Nobles)
  const checkIfAdmin = message.member.roles.cache.some(role => role.name === 'Taco Nobles' || role.name === 'Taco Knights' || role.name === 'Taco Prince' || role.name === 'Taco King')



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



  ////////////////////
  //                //
  //  Commands:     //
  //                //
  //  \help         //
  //  \caulk        //
  //  \weigh        //
  //  \fingers      //
  //  \succ         //
  //  \twitch       //
  //  \youtube      //
  //  \twitter      //
  //  \randomvideo  //
  //  \orisit       //
  //  \info         //
  //  \setstatus    //
  //  \resetstatus  //
  //  \modhelp      //
  //                //
  ////////////////////

  if (command === 'help') {
    embedCommand('Commands:', '**\\twitch** \nLinks to Jake\'s Twitch account \n \n**\\youtube** \nLinks to Jake\'s YouTube channels \n \n **\\twitter** \nLinks to Jake\'s Twitter accounts \n \n**\\randomvideo** \nLinks to a randomly selected Vsauce3 video \n \n**\\caulk** \n*\'cause I don\'t think you can handle it. You can\'t handle...* this command \n \n**\\weigh** \nWhat does this command do? *Mmm, very good question. But more importantly... how much does it weigh?* \n \n **\\fingers**\nHey, Vsauce. Michael here. *Where are your fingers?* \n \n **\\succ**\n***S  U  C  C*** \n \n **\\jakerobot**\nLinks to AI-generated tweets made using tweets by @jakerawr \n \n **\\orisit** \nPlays "Moon Men" by Jake Chudnow (a.k.a. the Vsauce theme)')
  }

  if (command === 'caulk') {
    if (!message.guild) return;
    if (!message.member.voice.channel) {
      message.channel.send('*\'cause I don\'t think you can handle it, you can\'t handle...* ***the caulk*** \nhttps://www.twitch.tv/jakeroper/clip/AbstemiousSlickFiddleheadsKappaRoss');
    }
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const caulkAudio = connection.play('./audioclips/caulk.mp3');
      embedCommand('Now playing:', '*\'cause I don\'t think you can handle it, you can\'t handle...* ***the caulk.*** \n*Requested by ' + mentionAuthor + '*');

      caulkAudio.on('finish', () => {
        message.guild.me.voice.channel.leave();
      })
    }
  }

  if (command === 'weigh') {
    if (!message.guild) return;
    if (!message.member.voice.channel) {
      message.channel.send('Mmm, very good question. But more importantly... *how much does it weigh?* \nhttps://youtu.be/4OzxNLYJDsE?list=PLiyjwVB09t5zvMrlbSP78hDMfyd_LALA4&t=320');
      embedCommand(' ', 'It weighs ' + (Math.floor(Math.random() * 1000000)) + ' Vsauces')
    }
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const weighAudio = connection.play('./audioclips/weigh.mp3');
      embedCommand('What am I playing?', 'Mmm, very good question. But more importantly... *how much does it weigh?* \n*Requested by ' + mentionAuthor + '*')

      weighAudio.on('finish', () => {
        message.guild.me.voice.channel.leave();
        embedCommand(' ', 'It weighs ' + (Math.floor(Math.random() * 1000000)) + ' Vsauces')
      })
    }
  }
 
  if (command === 'fingers') {
    if (!message.guild) return;
    if (!message.member.voice.channel) {
        message.channel.send('Hey, Vsauce. Michael here. *Where are your fingers?* \nhttps://youtu.be/L45Q1_psDqk')
    }
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const fingersAudio = connection.play('./audioclips/fingers.mp3');
      embedCommand('Now playing:', 'Hey, Vsauce. Michael here. *Where are your fingers?* \n*Requested by ' + mentionAuthor + '.*')

      fingersAudio.on('finish', () => {
        message.guild.me.voice.channel.leave();
      })
    }
  }

  if (command === 'succ') {
    if (!message.guild) return;
    if (!message.member.voice.channel) {
        message.channel.send('***S  U  C  C*** \nhttps://clips.twitch.tv/CoyTenuousMosquitoPMSTwin')
    }
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const succAudio = connection.play('./audioclips/succ.mp3');
      embedCommand('Now playing:', '***S  U  C  C*** \n*Requested by ' + mentionAuthor + '.*')

      succAudio.on('finish', () => {
        message.guild.me.voice.channel.leave();
      })
    }
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
    embedCommand('Bot information', '**Version**: 3.2.0 \n \n**Released on:** 27/7/2020 *(d/m/yyyy)* \n \n**Changelog:** https://montelion.gitbook.io/botsauce/changelog \n \n **Source code:** https://github.com/Montelion/BotSauce \n \n *Made with love by Monty#3581*');
  }

  if (command === 'randomvideo') {
    //This sends a random video from the array vsauce3vids [the last line of code]. It chooses a random number between 0 and 1, and it multiplies it by the number of links in the array vsauce3vids. Then it rounds up the result and gets the corresponding link (e.g. if the result is 69 (nice) the bot sends the 70th link in the list, because it counts from 0).
    message.channel.send('Here\'s your randomly selected Vsauce3 video:\n' + vsauce3vids[Math.floor(Math.random() * vsauce3vids.length)]);
  }

  if (command === 'jakerobot') {
    message.channel.send('Here\'s your AI generated tweet!\n https://twitter.com/jakerawr_but_AI/status/' + jakeRobotTweets[Math.floor(Math.random() * jakeRobotTweets.length)]);
  }

  if (command === 'orisit') {
    if (!message.guild) return;
    if (!message.member.voice.channel){
      embedCommand('Error!', mentionAuthor + ', you need to join a voice channel first!')
    }
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const orisitAudio = connection.play('./audioclips/orisit.mp3');
      embedCommand('Now playing:', '"Moon Men" by Jake Chudnow (a.k.a. the Vsauce theme) \n*Requested by ' + mentionAuthor + '.*')
      
      orisitAudio.on('finish', () => {
        message.guild.me.voice.channel.leave();
      })
    }
  }
    
  if (command === 'setstatus') {

    if (checkIfAdmin) {  // returns true if the member has at least one of the roles

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

  //THE COMMAND \CONFIRMSTATUS HAS BEEN DEPRECATED IN FAVOR OF A REACTION BASED CONFIRMATION (v2.2). For this reason it has been commented out.

  //  if (command === 'confirmstatus') {
  //
  //        if (checkIfAdmin) {  // returns true if the member has at least one of the roles
  //            customStatus(botStatus, presenceType)
  //            embedCommand('Success!', 'Status set to "' + statusPrefix + botStatus + '" by ' + mentionAuthor)
  //        }

  //        else {
  //           embedCommand('Oof', 'I\'m sorry ' + mentionAuthor + ', I can\'t let you do that.');   //The user who ran the command doesn't have the right role to run the command
  //        }
  //    }

  if (command === 'resetstatus') {

    if (checkIfAdmin) {
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

    if (checkIfAdmin) {
      embedCommand('Mod commands:', '**\\setstatus** \nSets a custom status for the bot.\n*Usage: \\setstatus followed by the status you want to set.* \n \n**\\resetstatus** \nResets the status to its original state. \n \n**\\info**: Shows the bot\'s version, release date, and changelog.')
    }

    else {
        embedCommand('Oof', 'I\'m sorry ' + mentionAuthor + ', I can\'t let you do that.');   //The user who ran the command doesn't have the right role to run the comamnd
    }
   }
});


client.login(botToken); //This uses the constant botToken to log in the bot

//An array of all Vsauce3 videos (used for \randomvideo). I had to copy each link by hand. AAAAAAAAAAAAAAAAAAAAAAAAAAAAA
const vsauce3vids = [ "https://www.youtube.com/watch?v=-GdUhPwH9Mo&list=UUwmFOfFuvRPI112vR5DNnrA&index=188", "https://www.youtube.com/watch?v=ag2EpAu1SL4&list=UUwmFOfFuvRPI112vR5DNnrA&index=187", "https://www.youtube.com/watch?v=Rohy6vIMbtM&list=UUwmFOfFuvRPI112vR5DNnrA&index=186", "https://www.youtube.com/watch?v=MejveUjpw8U&list=UUwmFOfFuvRPI112vR5DNnrA&index=185", "https://www.youtube.com/watch?v=6On625wKgu4&list=UUwmFOfFuvRPI112vR5DNnrA&index=184", "https://www.youtube.com/watch?v=1xOLykcWy6w&list=UUwmFOfFuvRPI112vR5DNnrA&index=183", "https://www.youtube.com/watch?v=8_Oqr2SEn_4&list=UUwmFOfFuvRPI112vR5DNnrA&index=182", "https://www.youtube.com/watch?v=6kZyAl-t4V4&list=UUwmFOfFuvRPI112vR5DNnrA&index=181", "https://www.youtube.com/watch?v=fz4th3e0cuM&list=UUwmFOfFuvRPI112vR5DNnrA&index=180", "https://www.youtube.com/watch?v=0kWfvahCyko&list=UUwmFOfFuvRPI112vR5DNnrA&index=179", "https://www.youtube.com/watch?v=FtoQsUg37n0&list=UUwmFOfFuvRPI112vR5DNnrA&index=178", "https://www.youtube.com/watch?v=Zwj6hbf7iyA&list=UUwmFOfFuvRPI112vR5DNnrA&index=177", "https://www.youtube.com/watch?v=MRe_LtAnGAM&list=UUwmFOfFuvRPI112vR5DNnrA&index=176", "https://www.youtube.com/watch?v=ZYFpAeqaCrw&list=UUwmFOfFuvRPI112vR5DNnrA&index=175", "https://www.youtube.com/watch?v=75-Wr-BthAY&list=UUwmFOfFuvRPI112vR5DNnrA&index=174", "https://www.youtube.com/watch?v=uUaMwlYeq-Q&list=UUwmFOfFuvRPI112vR5DNnrA&index=173", "https://www.youtube.com/watch?v=QnnloaHd19U&list=UUwmFOfFuvRPI112vR5DNnrA&index=172", "https://www.youtube.com/watch?v=BisqdK1u6yU&list=UUwmFOfFuvRPI112vR5DNnrA&index=171", "https://www.youtube.com/watch?v=zrAuEQsVOSs&list=UUwmFOfFuvRPI112vR5DNnrA&index=170", "https://www.youtube.com/watch?v=AWX7ZjWGARQ&list=UUwmFOfFuvRPI112vR5DNnrA&index=169", "https://www.youtube.com/watch?v=1B-QAqujqjw&list=UUwmFOfFuvRPI112vR5DNnrA&index=168", "https://www.youtube.com/watch?v=92P24DCVMs0&list=UUwmFOfFuvRPI112vR5DNnrA&index=167", "https://www.youtube.com/watch?v=3pHqE1Bbhuw&list=UUwmFOfFuvRPI112vR5DNnrA&index=166", "https://www.youtube.com/watch?v=x8Bu63xVZXQ&list=UUwmFOfFuvRPI112vR5DNnrA&index=165", "https://www.youtube.com/watch?v=-eFErjWRHP0&list=UUwmFOfFuvRPI112vR5DNnrA&index=164", "https://www.youtube.com/watch?v=IaMoxe0twDA&list=UUwmFOfFuvRPI112vR5DNnrA&index=163", "https://www.youtube.com/watch?v=ElAmA1TvLro&list=UUwmFOfFuvRPI112vR5DNnrA&index=162", "https://www.youtube.com/watch?v=iNCj2bRo4FE&list=UUwmFOfFuvRPI112vR5DNnrA&index=161", "https://www.youtube.com/watch?v=o3la4OkikB0&list=UUwmFOfFuvRPI112vR5DNnrA&index=160", "https://www.youtube.com/watch?v=wIoT7UQTF_w&list=UUwmFOfFuvRPI112vR5DNnrA&index=159", "https://www.youtube.com/watch?v=9sA0P4z0ilU&list=UUwmFOfFuvRPI112vR5DNnrA&index=158", "https://www.youtube.com/watch?v=MorQI2Q-BJI&list=UUwmFOfFuvRPI112vR5DNnrA&index=157", "https://www.youtube.com/watch?v=4YpcV7mVplY&list=UUwmFOfFuvRPI112vR5DNnrA&index=156", "https://www.youtube.com/watch?v=tNQMRm7CroI&list=UUwmFOfFuvRPI112vR5DNnrA&index=155", "https://www.youtube.com/watch?v=wiJRHzuiASs&list=UUwmFOfFuvRPI112vR5DNnrA&index=154", "https://www.youtube.com/watch?v=Od_BCEO098o&list=UUwmFOfFuvRPI112vR5DNnrA&index=153", "https://www.youtube.com/watch?v=lji9H3Ar4jM&list=UUwmFOfFuvRPI112vR5DNnrA&index=152", "https://www.youtube.com/watch?v=IXgqr-xGO2A&list=UUwmFOfFuvRPI112vR5DNnrA&index=151", "https://www.youtube.com/watch?v=t2ZWf-DeexY&list=UUwmFOfFuvRPI112vR5DNnrA&index=150", "https://www.youtube.com/watch?v=9mnsWoKiSx0&list=UUwmFOfFuvRPI112vR5DNnrA&index=149", "https://www.youtube.com/watch?v=48dESibj0PA&list=UUwmFOfFuvRPI112vR5DNnrA&index=148", "https://www.youtube.com/watch?v=ZEEjpMu0Epk&list=UUwmFOfFuvRPI112vR5DNnrA&index=147", "https://www.youtube.com/watch?v=IF88PuIWd9g&list=UUwmFOfFuvRPI112vR5DNnrA&index=146", "https://www.youtube.com/watch?v=nnhjYy2xhNY&list=UUwmFOfFuvRPI112vR5DNnrA&index=145", "https://www.youtube.com/watch?v=cO-qgdvDWTU&list=UUwmFOfFuvRPI112vR5DNnrA&index=144", "https://www.youtube.com/watch?v=V-fL8zopddI&list=UUwmFOfFuvRPI112vR5DNnrA&index=143", "https://www.youtube.com/watch?v=9At79-XlR38&list=UUwmFOfFuvRPI112vR5DNnrA&index=142", "https://www.youtube.com/watch?v=TRPP-qYS_M8&list=UUwmFOfFuvRPI112vR5DNnrA&index=141", "https://www.youtube.com/watch?v=baOlT-1yY4A&list=UUwmFOfFuvRPI112vR5DNnrA&index=140", "https://www.youtube.com/watch?v=GuNGbhk1Li4&list=UUwmFOfFuvRPI112vR5DNnrA&index=139", "https://www.youtube.com/watch?v=Zux_GebV374&list=UUwmFOfFuvRPI112vR5DNnrA&index=138", "https://www.youtube.com/watch?v=8VGDhGsYoSA&list=UUwmFOfFuvRPI112vR5DNnrA&index=137", "https://www.youtube.com/watch?v=2Wph34RbDeE&list=UUwmFOfFuvRPI112vR5DNnrA&index=136", "https://www.youtube.com/watch?v=Jq-NnQmI_2c&list=UUwmFOfFuvRPI112vR5DNnrA&index=135", "https://www.youtube.com/watch?v=rPzZOYeS0NE&list=UUwmFOfFuvRPI112vR5DNnrA&index=134", "https://www.youtube.com/watch?v=qglUAaI_9y0&list=UUwmFOfFuvRPI112vR5DNnrA&index=133", "https://www.youtube.com/watch?v=yNE2M_57rxU&list=UUwmFOfFuvRPI112vR5DNnrA&index=132", "https://www.youtube.com/watch?v=47rIvUs_bRk&list=UUwmFOfFuvRPI112vR5DNnrA&index=131", "https://www.youtube.com/watch?v=3b5_cQBap9w&list=UUwmFOfFuvRPI112vR5DNnrA&index=130", "https://www.youtube.com/watch?v=NGX-FCPNEyU&list=UUwmFOfFuvRPI112vR5DNnrA&index=129", "https://www.youtube.com/watch?v=vIVhTfT7u38&list=UUwmFOfFuvRPI112vR5DNnrA&index=128", "https://www.youtube.com/watch?v=xtHDQA4ge0k&list=UUwmFOfFuvRPI112vR5DNnrA&index=127", "https://www.youtube.com/watch?v=KnxowuQ1KvU&list=UUwmFOfFuvRPI112vR5DNnrA&index=126", "https://www.youtube.com/watch?v=BJDqSrW_2n0&list=UUwmFOfFuvRPI112vR5DNnrA&index=125", "https://www.youtube.com/watch?v=DMAI5jJWfKo&list=UUwmFOfFuvRPI112vR5DNnrA&index=124", "https://www.youtube.com/watch?v=9wIrd5BEGdA&list=UUwmFOfFuvRPI112vR5DNnrA&index=123", "https://www.youtube.com/watch?v=CKI-ovYW2Nw&list=UUwmFOfFuvRPI112vR5DNnrA&index=122", "https://www.youtube.com/watch?v=3vvuOe32oYM&list=UUwmFOfFuvRPI112vR5DNnrA&index=121", "https://www.youtube.com/watch?v=Lh-7kEk1ceE&list=UUwmFOfFuvRPI112vR5DNnrA&index=120", "https://www.youtube.com/watch?v=7EWH7jjz6Io&list=UUwmFOfFuvRPI112vR5DNnrA&index=119", "https://www.youtube.com/watch?v=MbVAKs1hF5o&list=UUwmFOfFuvRPI112vR5DNnrA&index=118", "https://www.youtube.com/watch?v=3-Ky6debNlA&list=UUwmFOfFuvRPI112vR5DNnrA&index=117", "https://www.youtube.com/watch?v=TdaX2cwiPqg&list=UUwmFOfFuvRPI112vR5DNnrA&index=116", "https://www.youtube.com/watch?v=1BIvon_zj40&list=UUwmFOfFuvRPI112vR5DNnrA&index=115", "https://www.youtube.com/watch?v=kSxB6Yi7wOg&list=UUwmFOfFuvRPI112vR5DNnrA&index=114", "https://www.youtube.com/watch?v=wySN_bcNSoo&list=UUwmFOfFuvRPI112vR5DNnrA&index=113", "https://www.youtube.com/watch?v=eSosT0Z_UvM&list=UUwmFOfFuvRPI112vR5DNnrA&index=112", "https://www.youtube.com/watch?v=-kkMrZYNrt0&list=UUwmFOfFuvRPI112vR5DNnrA&index=111", "https://www.youtube.com/watch?v=yt5aloWtzKU&list=UUwmFOfFuvRPI112vR5DNnrA&index=110", "https://www.youtube.com/watch?v=qwMud3eGbDo&list=UUwmFOfFuvRPI112vR5DNnrA&index=109", "https://www.youtube.com/watch?v=dW5jwbi5O2g&list=UUwmFOfFuvRPI112vR5DNnrA&index=108", "https://www.youtube.com/watch?v=8QHTdgQs_mc&list=UUwmFOfFuvRPI112vR5DNnrA&index=107", "https://www.youtube.com/watch?v=EU7X42E44ZE&list=UUwmFOfFuvRPI112vR5DNnrA&index=106", "https://www.youtube.com/watch?v=WwNKin0rWq8&list=UUwmFOfFuvRPI112vR5DNnrA&index=105", "https://www.youtube.com/watch?v=1aBRLhZ8mic&list=UUwmFOfFuvRPI112vR5DNnrA&index=104", "https://www.youtube.com/watch?v=l7S7C2kGq6I&list=UUwmFOfFuvRPI112vR5DNnrA&index=103", "https://www.youtube.com/watch?v=TbdH28prqac&list=UUwmFOfFuvRPI112vR5DNnrA&index=102", "https://www.youtube.com/watch?v=N-48RVaqZck&list=UUwmFOfFuvRPI112vR5DNnrA&index=101", "https://www.youtube.com/watch?v=chfIDmgB0x0&list=UUwmFOfFuvRPI112vR5DNnrA&index=100", "https://www.youtube.com/watch?v=vD25uojAZHQ&list=UUwmFOfFuvRPI112vR5DNnrA&index=99", "https://www.youtube.com/watch?v=vlHKSmATTng&list=UUwmFOfFuvRPI112vR5DNnrA&index=98", "https://www.youtube.com/watch?v=FUA4KzxZ-Xk&list=UUwmFOfFuvRPI112vR5DNnrA&index=97", "https://www.youtube.com/watch?v=3cesaPTik_Q&list=UUwmFOfFuvRPI112vR5DNnrA&index=96", "https://www.youtube.com/watch?v=0vjcGwZGBYI&list=UUwmFOfFuvRPI112vR5DNnrA&index=95", "https://www.youtube.com/watch?v=160GmnKOeps&list=UUwmFOfFuvRPI112vR5DNnrA&index=94", "https://www.youtube.com/watch?v=ch8sx-FU5UM&list=UUwmFOfFuvRPI112vR5DNnrA&index=93", "https://www.youtube.com/watch?v=w7ma8mweDGw&list=UUwmFOfFuvRPI112vR5DNnrA&index=92", "https://www.youtube.com/watch?v=MJLpfQ4X4Ok&list=UUwmFOfFuvRPI112vR5DNnrA&index=91", "https://www.youtube.com/watch?v=NeKNadbLukw&list=UUwmFOfFuvRPI112vR5DNnrA&index=90", "https://www.youtube.com/watch?v=5QwFmvs2KjU&list=UUwmFOfFuvRPI112vR5DNnrA&index=89", "https://www.youtube.com/watch?v=yn-r-u7rrvg&list=UUwmFOfFuvRPI112vR5DNnrA&index=88", "https://www.youtube.com/watch?v=Uj4YyfaCgB4&list=UUwmFOfFuvRPI112vR5DNnrA&index=87", "https://www.youtube.com/watch?v=rNnuOxusKuc&list=UUwmFOfFuvRPI112vR5DNnrA&index=86", "https://www.youtube.com/watch?v=ACNX5TEiZdQ&list=UUwmFOfFuvRPI112vR5DNnrA&index=85", "https://www.youtube.com/watch?v=88VEGNoIxj8&list=UUwmFOfFuvRPI112vR5DNnrA&index=84", "https://www.youtube.com/watch?v=r129W328PsE&list=UUwmFOfFuvRPI112vR5DNnrA&index=83", "https://www.youtube.com/watch?v=rXB6mxPepjM&list=UUwmFOfFuvRPI112vR5DNnrA&index=82", "https://www.youtube.com/watch?v=W0pmiAwWa3o&list=UUwmFOfFuvRPI112vR5DNnrA&index=81", "https://www.youtube.com/watch?v=SRjjpJwoAnw&list=UUwmFOfFuvRPI112vR5DNnrA&index=80", "https://www.youtube.com/watch?v=iNwW8LT1FaU&list=UUwmFOfFuvRPI112vR5DNnrA&index=79", "https://www.youtube.com/watch?v=9forL8sPf1s&list=UUwmFOfFuvRPI112vR5DNnrA&index=78", "https://www.youtube.com/watch?v=qP3IOe6PTEk&list=UUwmFOfFuvRPI112vR5DNnrA&index=77", "https://www.youtube.com/watch?v=ONCO7EtpAQE&list=UUwmFOfFuvRPI112vR5DNnrA&index=76", "https://www.youtube.com/watch?v=JQwJVfVAPLQ&list=UUwmFOfFuvRPI112vR5DNnrA&index=75", "https://www.youtube.com/watch?v=AOwRb584r1c&list=UUwmFOfFuvRPI112vR5DNnrA&index=74", "https://www.youtube.com/watch?v=WQy3Hki7rrA&list=UUwmFOfFuvRPI112vR5DNnrA&index=73", "https://www.youtube.com/watch?v=e3-kwFldc04&list=UUwmFOfFuvRPI112vR5DNnrA&index=72", "https://www.youtube.com/watch?v=_aThhtkbQjI&list=UUwmFOfFuvRPI112vR5DNnrA&index=71", "https://www.youtube.com/watch?v=8UqYfaxOJOg&list=UUwmFOfFuvRPI112vR5DNnrA&index=70", "https://www.youtube.com/watch?v=r6sGARbnnfM&list=UUwmFOfFuvRPI112vR5DNnrA&index=69", "https://www.youtube.com/watch?v=yOHzhR4wab4&list=UUwmFOfFuvRPI112vR5DNnrA&index=68", "https://www.youtube.com/watch?v=u2cphuMbqfc&list=UUwmFOfFuvRPI112vR5DNnrA&index=67", "https://www.youtube.com/watch?v=hjHdcGgF_wE&list=UUwmFOfFuvRPI112vR5DNnrA&index=66", "https://www.youtube.com/watch?v=pMzBiyLVfd8&list=UUwmFOfFuvRPI112vR5DNnrA&index=65", "https://www.youtube.com/watch?v=yBbpWauMHXo&list=UUwmFOfFuvRPI112vR5DNnrA&index=64", "https://www.youtube.com/watch?v=8EWIU2O_CdQ&list=UUwmFOfFuvRPI112vR5DNnrA&index=63", "https://www.youtube.com/watch?v=xkvo-DrU2gM&list=UUwmFOfFuvRPI112vR5DNnrA&index=62", "https://www.youtube.com/watch?v=7RJz4GqtR0Q&list=UUwmFOfFuvRPI112vR5DNnrA&index=61", "https://www.youtube.com/watch?v=-ILgn5X6FsU&list=UUwmFOfFuvRPI112vR5DNnrA&index=60", "https://www.youtube.com/watch?v=BIePWBgKaXw&list=UUwmFOfFuvRPI112vR5DNnrA&index=59", "https://www.youtube.com/watch?v=2bT5Q8GEp2E&list=UUwmFOfFuvRPI112vR5DNnrA&index=58", "https://www.youtube.com/watch?v=iNKgSPuWs-4&list=UUwmFOfFuvRPI112vR5DNnrA&index=57", "https://www.youtube.com/watch?v=iJwZ3uBzQV0&list=UUwmFOfFuvRPI112vR5DNnrA&index=56", "https://www.youtube.com/watch?v=Cla8sAiQqc4&list=UUwmFOfFuvRPI112vR5DNnrA&index=55", "https://www.youtube.com/watch?v=ygx0zcG5E8Y&list=UUwmFOfFuvRPI112vR5DNnrA&index=54", "https://www.youtube.com/watch?v=nsMxsIZSg08&list=UUwmFOfFuvRPI112vR5DNnrA&index=53", "https://www.youtube.com/watch?v=KvonpqDKRes&list=UUwmFOfFuvRPI112vR5DNnrA&index=52", "https://www.youtube.com/watch?v=-6NZMAbfmW0&list=UUwmFOfFuvRPI112vR5DNnrA&index=51", "https://www.youtube.com/watch?v=YvGlBFjxvgY&list=UUwmFOfFuvRPI112vR5DNnrA&index=50", "https://www.youtube.com/watch?v=qe72eAZsA5c&list=UUwmFOfFuvRPI112vR5DNnrA&index=49", "https://www.youtube.com/watch?v=ME1XNMjXjZU&list=UUwmFOfFuvRPI112vR5DNnrA&index=48", "https://www.youtube.com/watch?v=bSAX2Z5GNYo&list=UUwmFOfFuvRPI112vR5DNnrA&index=47", "https://www.youtube.com/watch?v=RGBID5G2RB0&list=UUwmFOfFuvRPI112vR5DNnrA&index=46", "https://www.youtube.com/watch?v=CJLMCT1aXRM&list=UUwmFOfFuvRPI112vR5DNnrA&index=45", "https://www.youtube.com/watch?v=20Fq2huhvEI&list=UUwmFOfFuvRPI112vR5DNnrA&index=44", "https://www.youtube.com/watch?v=GOoFkwj91pk&list=UUwmFOfFuvRPI112vR5DNnrA&index=43", "https://www.youtube.com/watch?v=hSUOsR_Si2M&list=UUwmFOfFuvRPI112vR5DNnrA&index=42", "https://www.youtube.com/watch?v=VpB3kan4BHQ&list=UUwmFOfFuvRPI112vR5DNnrA&index=41", "https://www.youtube.com/watch?v=5RAl8xATLzc&list=UUwmFOfFuvRPI112vR5DNnrA&index=40", "https://www.youtube.com/watch?v=BmSTUQncitk&list=UUwmFOfFuvRPI112vR5DNnrA&index=39", "https://www.youtube.com/watch?v=5NhijmGTwwo&list=UUwmFOfFuvRPI112vR5DNnrA&index=38", "https://www.youtube.com/watch?v=wOQ8H2t6I1I&list=UUwmFOfFuvRPI112vR5DNnrA&index=37", "https://www.youtube.com/watch?v=F0W6p1vN58Y&list=UUwmFOfFuvRPI112vR5DNnrA&index=36", "https://www.youtube.com/watch?v=nSvIxDbfk3k&list=UUwmFOfFuvRPI112vR5DNnrA&index=35", "https://www.youtube.com/watch?v=AORsw8NpN4E&list=UUwmFOfFuvRPI112vR5DNnrA&index=34", "https://www.youtube.com/watch?v=dh63v6bXEsA&list=UUwmFOfFuvRPI112vR5DNnrA&index=33", "https://www.youtube.com/watch?v=3d9i_0Ty7Cg&list=UUwmFOfFuvRPI112vR5DNnrA&index=32", "https://www.youtube.com/watch?v=qGgIC1GkBCw&list=UUwmFOfFuvRPI112vR5DNnrA&index=31", "https://www.youtube.com/watch?v=hV6Swl5O1hs&list=UUwmFOfFuvRPI112vR5DNnrA&index=30", "https://www.youtube.com/watch?v=9X8CU47FEyA&list=UUwmFOfFuvRPI112vR5DNnrA&index=29", "https://www.youtube.com/watch?v=SgKE8ZJ7OjM&list=UUwmFOfFuvRPI112vR5DNnrA&index=28", "https://www.youtube.com/watch?v=pZkCZ4LCO0o&list=UUwmFOfFuvRPI112vR5DNnrA&index=27", "https://www.youtube.com/watch?v=MG3VNLWzJm8&list=UUwmFOfFuvRPI112vR5DNnrA&index=26", "https://www.youtube.com/watch?v=K4XvpPwAN4A&list=UUwmFOfFuvRPI112vR5DNnrA&index=25", "https://www.youtube.com/watch?v=oHewZxGgOvw&list=UUwmFOfFuvRPI112vR5DNnrA&index=24", "https://www.youtube.com/watch?v=dRk1oMXGt78&list=UUwmFOfFuvRPI112vR5DNnrA&index=23", "https://www.youtube.com/watch?v=-PaggL0a7Gg&list=UUwmFOfFuvRPI112vR5DNnrA&index=22", "https://www.youtube.com/watch?v=-1fdhj5xS1g&list=UUwmFOfFuvRPI112vR5DNnrA&index=21", "https://www.youtube.com/watch?v=Q8gbC3SigR0&list=UUwmFOfFuvRPI112vR5DNnrA&index=20", "https://www.youtube.com/watch?v=X5EoUD-BIss&list=UUwmFOfFuvRPI112vR5DNnrA&index=19", "https://www.youtube.com/watch?v=ce2SfjvFIvU&list=UUwmFOfFuvRPI112vR5DNnrA&index=18", "https://www.youtube.com/watch?v=9FoBFOgOxDQ&list=UUwmFOfFuvRPI112vR5DNnrA&index=17", "https://www.youtube.com/watch?v=FJfcdJ7sizc&list=UUwmFOfFuvRPI112vR5DNnrA&index=16", "https://www.youtube.com/watch?v=YxAyxC-uJy4&list=UUwmFOfFuvRPI112vR5DNnrA&index=15", "https://www.youtube.com/watch?v=4OzxNLYJDsE&list=UUwmFOfFuvRPI112vR5DNnrA&index=14", "https://www.youtube.com/watch?v=hA0tOcNE4IY&list=UUwmFOfFuvRPI112vR5DNnrA&index=13", "https://www.youtube.com/watch?v=yH0iFABR8M8&list=UUwmFOfFuvRPI112vR5DNnrA&index=12", "https://www.youtube.com/watch?v=Y7V2d-h1U-A&list=UUwmFOfFuvRPI112vR5DNnrA&index=11", "https://www.youtube.com/watch?v=RVFCCSQJymI&list=UUwmFOfFuvRPI112vR5DNnrA&index=10", "https://www.youtube.com/watch?v=qG-pCutNCf8&list=UUwmFOfFuvRPI112vR5DNnrA&index=9", "https://www.youtube.com/watch?v=901iIpIyNrw&list=UUwmFOfFuvRPI112vR5DNnrA&index=8", "https://www.youtube.com/watch?v=yLhpktxpr7w&list=UUwmFOfFuvRPI112vR5DNnrA&index=7", "https://www.youtube.com/watch?v=Z0_Ut4ItGio&list=UUwmFOfFuvRPI112vR5DNnrA&index=6", "https://www.youtube.com/watch?v=9JXCvcVWI0E&list=UUwmFOfFuvRPI112vR5DNnrA&index=5", "https://www.youtube.com/watch?v=84vGICi0Gt0&list=UUwmFOfFuvRPI112vR5DNnrA&index=4", "https://www.youtube.com/watch?v=sD34AZza6QU&list=UUwmFOfFuvRPI112vR5DNnrA&index=3", "https://www.youtube.com/watch?v=dstqPqg7gbY&list=UUwmFOfFuvRPI112vR5DNnrA&index=2", "https://www.youtube.com/watch?v=CJgL_3Fbbug&list=UUwmFOfFuvRPI112vR5DNnrA&index=1" ];

const jakeRobotTweets = [ "1287544609900503042?s=20", "1287544674920665092?s=20", "1287544746752319488?s=20", "1287544808299536384?s=20", "1287544913165520901?s=20", "1287545206791864320?s=20", "1287545569095954437?s=20", "1287546270073192450?s=20", "1287546340252307459?s=20", "1287546590845112320?s=20", "1287546762513850368?s=20", "1287546894466547718?s=20", "1287547955533221893?s=20", "1287548355942522891?s=20", "1287548933204574210?s=20", "1287549416451330048?s=20", "1287553983813316608?s=20", "1287562230838558720?s=20", "1287594796266160128?s=20", "1287598959570100224?s=20", "1287774825294028808?s=20", "1287775174692085762?s=20", "1287821972198567938?s=20", "1287822513699983365?s=20", "1287825271614300160?s=20", "1287833724776833024?s=20", "1287833912044134400?s=20", "1287834320015687680?s=20", "1287834371383341056?s=20", "1287834652741427201?s=20", "1287834979918061575?s=20", "1287835412325695493?s=20", "1287838218919055362?s=20", "1287838225944518656?s=20", "1287838236052725766?s=20", "1287838236052725766?s=20", "1287838241807306752?s=20", "1287838992310861824?s=20" ]
