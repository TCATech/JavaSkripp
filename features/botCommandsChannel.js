const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  client.on("messageCreate", (message) => {
    if (message.channel.id !== client.config.channels.botCommands) return;
    setTimeout(() => {
      message.delete();
    }, 15000);
  });
};
