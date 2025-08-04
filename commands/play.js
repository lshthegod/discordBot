/* const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
  name: 'play', // 이건 내부 확인용 (optional)
  async execute(message) {
    const url = message.content.slice(6).trim(); // '!play ' 제거
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('음성 채널에 먼저 입장해주세요!');
    }

    if (!url) {
      return message.reply('재생할 음악의 URL을 입력해주세요!');
    }

    const loadingMsg = await message.reply('🎵 음악을 불러오는 중...');

    try {
      if (!ytdl.validateURL(url)) {
        return loadingMsg.edit('유효한 YouTube URL을 입력해주세요.');
      }

      const stream = ytdl(url, { 
        highWaterMark: 1 << 25,
        filter: 'audioonly',
        liveBuffer: 4900,
        quality: 'highestaudio'
      });

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();
      const resource = createAudioResource(stream, { inlineVolume: true });
      resource.volume.setVolume(0.5);

      connection.subscribe(player);
      player.play(resource);

      player.on(AudioPlayerStatus.Idle, () => {
        if (connection.state.status !== 'destroyed') connection.destroy();
      });

      player.on('error', error => {
        console.error('재생 에러:', error);
        if (connection.state.status !== 'destroyed') connection.destroy();
        message.channel.send('음악 재생 중 오류가 발생했습니다.');
      });

      await loadingMsg.edit('🎵 재생을 시작합니다!');
    } catch (error) {
      console.error('Play error:', error);
      await loadingMsg.edit('음악 재생 중 오류가 발생했습니다. URL을 다시 확인해주세요.');
    }
  }
};
 */