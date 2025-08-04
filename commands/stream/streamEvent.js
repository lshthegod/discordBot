const { AudioPlayerStatus } = require('@discordjs/voice');

function registerPlayerEvents(player, connection, message) {
  player.on(AudioPlayerStatus.Idle, () => {
    if (connection.state.status !== 'destroyed') connection.destroy();
  });

  player.on('error', error => {
    console.error('재생 에러:', error);
    if (connection.state.status !== 'destroyed') connection.destroy();
    message.channel.send('음악 재생 중 오류가 발생했습니다.');
  });
}

module.exports = { registerPlayerEvents };
