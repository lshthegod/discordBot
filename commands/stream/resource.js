const { createAudioResource } = require('@discordjs/voice');

function createAudio(stream, volume = 0.5) {
  const resource = createAudioResource(stream, { inlineVolume: true });
  resource.volume.setVolume(volume);
  return resource;
}

module.exports = { createAudio };