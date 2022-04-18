const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kicks a user from the server.",
  userPerms: ["KICK_MEMBERS", "MODERATE_MEMBERS", "ADMINISTRATOR"],
  options: [
    {
      name: "user",
      description: "The user you want to kick.",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the kick.",
      type: "STRING",
      required: false,
    },
  ],
  /**
   *
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
            .setTitle("Beep. There's an error.")
            .setDescription("The mentioned user isn't in the server.")
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

    if (user.id === interaction.member.id)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Beep. There's an error.")
            .setDescription("You can't kick yourself.")
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
            .setTitle("Beep. There's an error.")
            .setDescription(
              "You can't kick someone that has the exact same or a higher role than you."
            )
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    if (!user.kickable)
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Beep. There's an error.")
            .setDescription("I can't kick that member.")
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    user.kick({ reason });
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Aaaand he's gone.")
          .setDescription("I have kciked " + user.tag + " successfully.")
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
