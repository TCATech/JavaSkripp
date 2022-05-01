const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans a user from the server.",
  userPerms: ["BAN_MEMBERS"],
  usage: "<user> [reason]",
  aliases: ["b"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!member)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("You didn't mention a member. Please do so!")
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    args.shift();
    const reason = args.join(" ") || "No reason provided.";

    if (member.id === message.author.id)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("You can't ban yourself.")
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription(
              "You can't ban someone that has the exact same or a higher role than you."
            )
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    if (!member.bannable)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("I can't ban that member.")
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    member.ban({ reason });
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Aaaand he's gone.")
          .setDescription("I have banned " + member.user.tag + " successfully.")
          .addField("Reason", reason)
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
