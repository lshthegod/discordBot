const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'play',
    description: '음악을 재생합니다',
    options: [
      {
        name: 'url',
        description: 'YouTube URL',
        type: 3, // STRING
        required: true
      }
    ]
  }
];

async function deployCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

deployCommands();