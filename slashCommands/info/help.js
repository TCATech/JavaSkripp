const {
  Client,
  Interaction,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const emojis = {
  games: "🎮",
  information: "📰",
  moderation: "🔨",
  utilities: "🔧",
};
const name = {
  games: "Games",
  info: "Information",
  moderation: "Moderation",
  utilities: "Utilities",
};
const description = {
  games: "game",
  information: "information",
  moderation: "moderation",
  utilities: "utility",
};

module.exports = {
  name: "help",
  description: "Get some help.",
  options: [
    {
      name: "command",
      description: "The name of the command you want help for.",
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
    /**
     *
     * @param {String} str
     * @returns string
     */
    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
    if (interaction.options.getString("command")) {
      const embed = new MessageEmbed();
      const cmd =
        client.slashCommands.get(interaction.options.getString("command")) ||
        client.slashCommands.find((c) =>
          c.aliases?.includes(
            interaction.options.getString("command").toLowerCase()
          )
        );
      if (!cmd) {
        return interaction.reply({
          embeds: [
            embed
              .setColor(interaction.color)
              .setDescription(
                `No information found for command "${interaction.options.getString(
                  "command"
                )}".`
              )
              .setTitle("Uh oh!")
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      }
      if (cmd.name) embed.addField("Command name", `\`${cmd.name}\``);
      if (cmd.name) embed.setTitle(`Detailed Information about ${cmd.name}`);
      if (cmd.description)
        embed.addField("Description", `\`${cmd.description}\``);
      if (cmd.directory)
        embed.addField(
          "Category",
          `\`${formatString(description[cmd.directory])}\``
        );
      if (cmd.options) {
        const allOptions = [];
        cmd.options.forEach((option) => {
          allOptions.push(option.name);
        });
        embed.addField("Options", `\`${allOptions.join(", ")}\``);
      } else {
        embed.addField("*Options", "None");
      }
      return interaction.reply({
        embeds: [embed.setColor(interaction.color).setTimestamp()],
        ephemeral: true,
      });
    } else {
      const directories = [
        ...new Set(client.slashCommands.map((cmd) => cmd.directory)),
      ];

      const categories = directories.map((dir) => {
        const getCommands = client.slashCommands
          .filter((cmd) => cmd.directory === dir)
          .map((cmd) => {
            return {
              name: cmd.name,
              description: cmd.description,
            };
          });

        return {
          directory: formatString(name[dir]),
          commands: getCommands,
        };
      });

      const embed = new MessageEmbed()
        .setTitle("I heard you needed some help.")
        .setDescription(
          "Please choose a category using the dropdown menu below. If you want to see information about a specific command, use `/help [command]`. For example: `/help ban`."
        )
        .setColor(interaction.color)
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      /**
       *
       * @param {Boolean} state
       * @returns MessageActionRow
       */
      const components = (state) => [
        new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("help-menu")
            .setPlaceholder("Category...")
            .setDisabled(state)
            .addOptions(
              categories.map((cmd) => {
                return {
                  label: cmd.directory,
                  value: cmd.directory.toLowerCase(),
                  emoji: emojis[cmd.directory.toLowerCase()],
                  description: `Shows all the ${
                    description[cmd.directory.toLowerCase()]
                  } commands!`,
                };
              })
            )
        ),
      ];

      await interaction.reply({
        embeds: [embed],
        components: components(false),
        fetchReply: true,
        ephemeral: true,
      });

      const filter = (int) => int.user.id === interaction.user.id;

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        componentType: "SELECT_MENU",
      });

      collector.on("collect", (int) => {
        const [directory] = int.values;
        const category = categories.find(
          (x) => x.directory.toLowerCase() === directory
        );

        const categoryEmbed = new MessageEmbed()
          .setTitle(`${formatString(directory)} commands`)
          .addFields(
            category.commands.map((cmd) => {
              return {
                name: `\`${cmd.name}\``,
                value: cmd.description,
                inline: true,
              };
            })
          )
          .setColor(interaction.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();

        int.update({ embeds: [categoryEmbed] });
      });

      collector.on("end", () => {
        interaction.editReply({
          content: "You ran out of time! Do /help again.",
          components: components(true),
        });
      });
    }
  },
};
