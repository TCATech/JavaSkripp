const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  client.on("messageCreate", (message) => {
    if (message.channel.id !== client.config.channels.botCommands) return;
    try {
      setTimeout(() => {
        message.delete();
      }, 15000);
    } catch {
      console.log("Message already deleted.");
    }
  });
};
