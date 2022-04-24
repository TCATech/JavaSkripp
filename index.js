// Bot client

const Discord = require("discord.js");
require("dotenv/config");
const client = new Discord.Client({
  intents: 32767,
  restTimeOffset: 0,
});
module.exports = client;

client.config = require("./config");
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.voiceGenerator = new Discord.Collection();

require("./handler")(client);

client.login(process.env.TOKEN);

// DisTube client

const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnFinish: false,
  leaveOnStop: true,
  searchSongs: true,
  emitAddListWhenCreatingQueue: false,
  emitAddSongWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ],
})
