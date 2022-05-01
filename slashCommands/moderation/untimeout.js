const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "untimeout",
  description: "Remove a timeout for someone, letting them talk again.",
  userPerms: ["MODERATE_MEMBERS"],
  options: [
    {
      name: "user",
      description: "The user you want to untimeout.",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the untimeout.",
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
      return interaction.reply({
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
        ephemeral: true,
      });
    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    if (user.id === interaction.member.id)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("You can't untimeout yourself.")
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    if (
      user.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interactiopn.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription(
              "You can't untimeout someone that has the exact same or a higher role than you."
            )
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    if (!user.manageable)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("I can't untimeout that member.")
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    user.timeout(null, reason);
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Aaaaand he's back.")
          .setDescription(
            "I have un-timed out " + user.user.tag + " successfully."
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
