const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { animals } = require("nampis");

module.exports = {
  name: "dog",
  description: "Fetches you a cute dog.",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const embed = new MessageEmbed()
      .setTitle("🐶 Woof! 🐶")
      .setImage(await animals.dog())
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor(interaction.color)
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
