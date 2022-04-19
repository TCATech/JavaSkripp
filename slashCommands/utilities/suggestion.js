const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { statusMessages } = require("../../features/suggestions");

module.exports = {
  name: "suggestion",
  description: "Accept or deny a suggestion.",
  userPerms: ["ADMINISTRATOR"],
  options: [
    {
      name: "accept",
      description: "Accept a suggestion.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "The message ID of the suggestion.",
          type: "STRING",
          required: true,
        },
        {
          name: "reason",
          description: "The reason you are accepting the suggestion.",
          type: "STRING",
          required: false,
        },
      ],
    },
    {
      name: "deny",
      description: "Deny a suggestion.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "The message ID of the suggestion.",
          type: "STRING",
          required: true,
        },
        {
          name: "reason",
          description: "The reason you are denying the suggestion.",
          type: "STRING",
          required: false,
        },
      ],
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const embed = new MessageEmbed()
      .setColor(client.config.color)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    const { guild, options } = interaction;

    const messageId = options.getString("id");
    const reason = options.getString("reason");

    const channelId = client.config.channels.suggestions;
    const channel = guild.channels.cache.get(channelId);
    if (!channel)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription(
              "I couldn't find the suggestions channel. I think someone deleted it! Oh no!"
            ),
        ],
        ephemeral: true,
      });

    const targetMessage = await channel.messages.fetch(messageId, {
      cache: false,
      force: true,
    });
    if (!channel)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription("The message no longer exists."),
        ],
        ephemeral: true,
      });

    let newStatus = "";
    targetMessage.reactions.removeAll();

    switch (options.getSubcommand()) {
      case "accept":
        {
          newStatus = statusMessages["ACCEPTED"];
          const oldEmbed = targetMessage.embeds[0];
          const newEmbed = new MessageEmbed()
            .setAuthor({
              name: oldEmbed.author.name,
              iconURL: oldEmbed.author.iconURL,
            })
            .setDescription(oldEmbed.description)
            .setColor(newStatus.color)
            .setFooter({
              text: "Wanna suggest something? Simply type it in this channel!",
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .addFields({
              name: "Status",
              value: `${newStatus.text}${reason ? ` Reason: ${reason}` : ""}`,
            });

          targetMessage.edit({ embeds: [newEmbed] });
          interaction.reply({
            embeds: [
              embed
                .setTitle("Woo hoo!")
                .setDescription(
                  "I have successfully accepted that suggestion!"
                ),
            ],
            ephemeral: true,
          });
        }
        break;
      case "deny":
        {
          newStatus = statusMessages["DENIED"];
          const oldEmbed = targetMessage.embeds[0];
          const newEmbed = new MessageEmbed()
            .setAuthor({
              name: oldEmbed.author.name,
              iconURL: oldEmbed.author.iconURL,
            })
            .setDescription(oldEmbed.description)
            .setColor(newStatus.color)
            .setFooter({
              text: "Wanna suggest something? Simply type it in this channel!",
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .addFields({
              name: "Status",
              value: `${newStatus.text}${reason ? ` Reason: ${reason}` : ""}`,
            });

          targetMessage.edit({ embeds: [newEmbed] });
          interaction.reply({
            embeds: [
              embed
                .setTitle("Woo hoo!")
                .setDescription("I have successfully denied that suggestion!"),
            ],
            ephemeral: true,
          });
        }
        break;
    }
  },
};
