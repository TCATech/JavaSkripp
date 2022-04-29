const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "membercount",
  description: "Tells you how many members are in this server.",
  aliases: ["members", "usercount", "users"],
  /*
   *
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message) => {
    message.reply({
      embeds: [
        new MessageEmbed()
          .addField("Members", message.guild.memberCount.toLocaleString())
          .addField(
            "Humans",
            message.guild.members.cache
              .filter((member) => !member.user.bot)
              .size.toLocaleString()
          )
          .addField(
            "Bots",
            message.guild.members.cache
              .filter((member) => member.user.bot)
              .size.toLocaleString()
          )
          .setColor(client.config.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
    });
  },
};
