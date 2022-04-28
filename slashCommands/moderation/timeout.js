const { Client, Interaction, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "timeout",
  description:
    "Times out a member from the server, basically stopping them from talking.",
  userPerms: ["MODERATE_MEMBERS"],
  options: [
    {
      name: "user",
      description: "The user you want to timeout.",
      type: "USER",
      required: true,
    },
    {
      name: "time",
      description: "The amount of time you want to timeout the user for.",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "60 seconds",
          value: "1m",
        },
        {
          name: "5 minutes",
          value: "5m",
        },
        {
          name: "10 minutes",
          value: "10m",
        },
        {
          name: "1 hour",
          value: "1h",
        },
        {
          name: "1 day",
          value: "1d",
        },
        {
          name: "1 week",
          value: "7d",
        },
      ],
    },
    {
      name: "reason",
      description: "The reason for the timeout.",
      type: "STRING",
      required: false,
    },
  ],
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async (client, interaction) => {
    const user = interaction.guild.members.cache.get(
      interaction.options.getUser("user").id
    );
    if (!user)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("The mentioned user isn't in the server.")
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    const time = ms(interaction.options.getString("time"));
    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    if (user.id === interaction.member.id)
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

    if (
      user.roles.highest.position >= interaction.member.roles.highest.position
    )
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
    interaction.reply({
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
