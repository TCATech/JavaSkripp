const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { animals } = require("nampis");

module.exports = {
  name: "cat",
  description: "Fetches you a cute cat.",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const embed = new MessageEmbed()
      .setTitle("🐱 Meow! 🐱")
      .setImage(await animals.cat())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor(interaction.color)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
