const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "membercount",
  description: "Tells you how many members are in this server.",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async (client, interaction) => {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .addField("Members", interaction.guild.memberCount.toLocaleString())
          .addField(
            "Humans",
            interaction.guild.members.cache
              .filter((member) => !member.user.bot)
              .size.toLocaleString()
          )
          .addField(
            "Bots",
            interaction.guild.members.cache
              .filter((member) => member.user.bot)
              .size.toLocaleString()
          )
          .setColor(interaction.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
    });
  },
};
