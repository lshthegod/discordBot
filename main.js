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

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.on(Events.MessageCreate, async message => {
  if (message.content === 'ping') {
    await message.reply('Pong!');
  }

  // !play 명령어 처리
  if (message.content.startsWith('!play ')) {
    console.log('play 명령어 실행');
    const url = message.content.slice(6).trim(); // '!play ' 제거하고 공백 제거
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('음성 채널에 먼저 입장해주세요!');
    }

    if (!url) {
      return message.reply('재생할 음악의 URL을 입력해주세요!');
    }

    const loadingMsg = await message.reply('🎵 음악을 불러오는 중...');

    try {
      console.log('Original URL:', url);
      
      // URL이 YouTube 링크인지 확인
      let videoUrl = url;
      if (!ytdl.validateURL(url)) {
        return loadingMsg.edit('유효한 YouTube URL을 입력해주세요.');
      }

      console.log('Valid YouTube URL:', videoUrl);

      // YouTube 영상 정보 가져오기
      // const videoInfo = await ytdl.getInfo(videoUrl);
      const stream = ytdl(videoUrl, { 
        highWaterMark: 1 << 25,
        filter: 'audioonly',
        liveBuffer: 4900,
        quality: 'highestaudio'
      });
      
      // 음성 채널에 연결
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      // 오디오 플레이어 생성
      const player = createAudioPlayer();
      const resource = createAudioResource(stream, {
        inlineVolume: true
      });

      // 볼륨 설정
      resource.volume.setVolume(0.5);

      // 플레이어를 연결에 할당
      connection.subscribe(player);
      player.play(resource);

      // 재생 완료 시 연결 해제
      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

      // 에러 처리
      player.on('error', error => {
        console.error(error);
        if (connection && connection.state.status !== 'destroyed') {
          connection.destroy();
        } else {
          console.log('Connection already destroyed.');
        }
        message.channel.send('음악 재생 중 오류가 발생했습니다.');
      });

      // await loadingMsg.edit(`🎵 **${videoInfo.videoDetails.title}** 재생을 시작합니다!`);
      await loadingMsg.edit(`🎵 재생을 시작합니다!`);

    } catch (error) {
      console.error('Play error:', error);
      await loadingMsg.edit('음악 재생 중 오류가 발생했습니다. URL을 다시 확인해주세요.');
    }
  }
});

client.login(process.env.TOKEN);
