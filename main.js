const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates,
]});

client.on(Events.MessageCreate, async message => {
  if (message.content === 'ping') {
    await message.reply('Pong!');
  }

  // !play 명령어 처리
  if (message.content.startsWith('!play ')) {
    const playCommand = require('./commands/play');
    return playCommand.execute(message);
  }
});

client.login(process.env.TOKEN);
