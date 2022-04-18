const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans a user from the server.",
  userPerms: ["BAN_MEMBERS", "MODERATE_MEMBERS", "ADMINISTRATOR"],
  options: [
    {
      name: "user",
      description: "The user you want to ban.",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the ban.",
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
            .setDescription("You can't ban yourself.")
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
      return interaction.reply({
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
        ephemeral: true,
      });
    if (!user.bannable)
      return interaction.reply({
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
        ephemeral: true,
      });
    member.ban({ reason });
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Aaaand he's gone.")
          .setDescription("I have banned " + user.tag + " successfully.")
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
