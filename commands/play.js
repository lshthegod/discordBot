const { createAudioPlayer } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { getAudioStream } = require('./stream/stream');
const { createAudio } = require('./stream/resource');
const { createVoiceConnection } = require('./stream/connection');
const { registerPlayerEvents } = require('./stream/streamEvent');

module.exports = {
  name: 'play',
  async execute(message) {
    const url = message.content.slice(6).trim();
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

      const stream = getAudioStream(url);
      const connection = createVoiceConnection(message);
      const player = createAudioPlayer();
      const resource = createAudio(stream);

      connection.subscribe(player);
      player.play(resource);

      registerPlayerEvents(player, connection, message);

      await loadingMsg.edit('🎵 재생을 시작합니다!');
    } catch (error) {
      console.error('Play error:', error);
      await loadingMsg.edit('음악 재생 중 오류가 발생했습니다. URL을 다시 확인해주세요.');
    }
  }
};
