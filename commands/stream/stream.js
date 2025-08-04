const ytdl = require('ytdl-core');

function getAudioStream(url) {
  return ytdl(url, {
    highWaterMark: 1 << 25,
    filter: 'audioonly',
    liveBuffer: 4900,
    quality: 'highestaudio',
  });
}

module.exports = { getAudioStream };
