const Discord = require("discord.js");
require("dotenv/config");
const client = new Discord.Client({
  intents: 32767,
  restTimeOffset: 0,
});
module.exports = client;

client.config = require("./config");
client.events = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.voiceGenerator = new Discord.Collection();

require("./handler")(client);

client.login(process.env.TOKEN);

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnStop: false,
  leaveOnFinish: false,
  savePreviousSongs: true,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
  youtubeDL: false,
  updateYouTubeDL: false,
  emitAddListWhenCreatingQueue: false,
  emitAddSongWhenCreatingQueue: false,
});
