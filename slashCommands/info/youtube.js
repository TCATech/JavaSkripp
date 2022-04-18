const { Client, Interaction } = require("discord.js");

module.exports = {
  name: "youtube",
  description: "Sends you a link to g8's YouTube channel.",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async (client, interaction) => {
    interaction.reply({
      content:
        "g8speedy: https://youtube.com/channel/UCbrRIs4V846jmnd3Yq7sxrw\nNot TCA: https://youtube.com/c/NotTCA",
      ephemeral: true,
    });
  },
};
