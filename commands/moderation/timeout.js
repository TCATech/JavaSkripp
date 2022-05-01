const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const acceptableTimes = [
  ms("1m"),
  ms("5m"),
  ms("10m"),
  ms("1h"),
  ms("1d"),
  ms("7d"),
];

module.exports = {
  name: "timeout",
  description:
    "Times out a member from the server, basically stopping them from talking.",
  userPerms: ["MODERATE_MEMBERS"],
  usage: "<user> <time> [reason]",
  aliases: ["tm", "to", "mute", "m"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!user)
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
    if (!args[1])
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription(
              "You didn't mention a time to timeout that member. Please do so!"
            )
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    const time = ms(args[1]);
    if (!acceptableTimes.includes(time))
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("The time you mentioned is invalid.")
            .addField(
              "Valid times",
              "`60 seconds, 5 minutes, 10 minutes, 1 hour, 1 day, 1 week`"
            )
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    if (user.id === message.author.id)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("You can't timeout yourself.")
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });

    if (user.roles.highest.position >= mesage.member.roles.highest.position)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription(
              "You can't timeout someone that has the exact same or a higher role than you."
            )
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    if (!user.manageable)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("I can't timeout that member.")
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    user.timeout(time, reason);
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Aaaaand he's gone.")
          .setDescription(
            "I have timed out " + user.user.tag + " successfully."
          )
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
