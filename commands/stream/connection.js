const { joinVoiceChannel } = require('@discordjs/voice');

function createVoiceConnection(message) {
  return joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator,
  });
}

module.exports = { createVoiceConnection };
