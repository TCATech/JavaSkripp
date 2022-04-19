const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { db } = require("../../models/afk");
const model = require("../../models/afk");

module.exports = {
  name: "afk",
  description: "Tell everyone that you are AFK.",
  options: [
    {
      name: "set",
      description: "Set your AFK status.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "reason",
          description: "The reason you are AFK.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "return",
      description: "Return from being AFK.",
      type: "SUB_COMMAND",
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const { guild, options, user, createdTimestamp } = interaction;

    const embed = new MessageEmbed()
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setColor(client.config.color)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    const subCommand = options.getSubcommand();
    switch (subCommand) {
      case "set":
        {
          const reason = options.getString("reason");
          await model.findOneAndUpdate(
            {
              User: user.id,
            },
            {
              Reason: reason || "No reason provided.",
              Time: parseInt(createdTimestamp / 1000),
              OriginalName:
                interaction.guild.members.cache.get(user.id).nickname ||
                user.username,
            },
            {
              new: true,
              upsert: true,
            }
          );

          interaction.guild.members.cache
            .get(user.id)
            .setNickname(
              `[AFK] ${
                interaction.guild.members.cache.get(user.id).nickname ||
                user.username
              }`
            );

          interaction.reply({
            embeds: [
              embed
                .setDescription(`You are now AFK.`)
                .addField("Reason", `${reason || "No reason provided."}`),
            ],
            ephemeral: true,
          });
        }
        break;
      case "return":
        {
          model.findOne(
            {
              User: user.id,
            },
            async (err, data) => {
              if (err) throw err;
              if (data) {
                interaction.guild.members.cache
                  .get(user.id)
                  .setNickname(`${data.OriginalName}`);
                await data.remove();
                interaction.reply({
                  embeds: [embed.setDescription("You are no longer AFK.")],
                  ephemeral: true,
                });
              }
            }
          );
        }
        break;
    }
  },
};
