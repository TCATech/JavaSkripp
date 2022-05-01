const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "servericon",
  description: "Gets the icon of the server.",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const avatar = message.guild.iconURL({ size: 4096, dynamic: true });

    const embed = new MessageEmbed()
      .setTitle(`Icon of ${message.guild.name}`)
      .setDescription(
        "[Click here to download](" + avatar.replace("webp", "png") + ")"
      )
      .setImage(avatar)
      .setColor(client.config.color)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    interaction.reply({
      embeds: [embed],
    });
  },
};
