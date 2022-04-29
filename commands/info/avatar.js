const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Gets the avatar of a user.",
  usage: "[user]",
  aliases: ["av", "pfp"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const member = message.mentions.members.first() || message.member;

    const avatar = member.displayAvatarURL({ size: 4096, dynamic: true });

    const embed = new MessageEmbed()
      .setTitle(`Avatar of ${member.user.username}`)
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

    message.reply({
      embeds: [embed],
    });
  },
};
