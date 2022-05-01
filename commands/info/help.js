const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const emojis = {
  fun: "🎲",
  games: "🎮",
  information: "📰",
  moderation: "🔨",
  music: "🎵",
  utilities: "🔧",
};
const name = {
  fun: "Fun",
  games: "Games",
  info: "Information",
  moderation: "Moderation",
  music: "Music",
  utilities: "Utilities",
};
const description = {
  fun: "fun",
  games: "game",
  information: "information",
  moderation: "moderation",
  music: "music",
  utilities: "utility",
};

module.exports = {
  name: "help",
  description: "Get some help.",
  usage: "[command]",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    /**
     *
     * @param {String} str
     * @returns string
     */
    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
    if (args[0]) {
      const embed = new MessageEmbed();
      const cmd =
        client.commands.get(args[0]) ||
        client.commands.find((c) => c.aliases?.includes(args[0].toLowerCase()));
      if (!cmd) {
        return message.reply({
          embeds: [
            embed
              .setColor("RED")
              .setDescription(
                `No information found for command "${args[0]}". Try using slash commands.`
              )
              .setTitle("Uh oh!")
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp(),
          ],
        });
      }
      if (cmd.name) embed.addField("Command name", `\`${cmd.name}\``);
      if (cmd.name) embed.setTitle(`Detailed Information about ${cmd.name}`);
      if (cmd.description)
        embed.addField("Description", `\`${cmd.description}\``);
      if (cmd.directory)
        embed.addField("Category", `\`${name[cmd.directory]}\``);
      if (cmd.userPerms)
        embed.addField("Permissions", cmd.userPerms.join(", "));
      if (cmd.aliases) embed.addField("Permissions", cmd.aliases.join(", "));
      if (cmd.usage) {
        embed
          .addField(
            "Usage",
            "`" + client.config.prefix + cmd.name + " " + cmd.usage + "`"
          )
          .setFooter({
            text: "<> = Required | [] = Optional",
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          });
      }
      return message.reply({
        embeds: [embed.setColor(message.color).setTimestamp()],
      });
    } else {
      const directories = [
        ...new Set(client.slashCommands.map((cmd) => cmd.directory)),
      ];

      const categories = directories.map((dir) => {
        const getCommands = client.commands
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
          `Please choose a category using the dropdown menu below. If you want to see information about a specific command, use \`${client.config.prefix}help [command]\`. For example: \`${client.config.prefix}help ban\`.`
        )
        .setColor(message.color)
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

      const msg = await message.reply({
        embeds: [embed],
        components: components(false),
      });

      const filter = (int) => int.user.id === message.author.id;

      const collector = message.channel.createMessageComponentCollector({
        filter,
        componentType: "SELECT_MENU",
      });

      collector.on("collect", (int) => {
        const [directory] = int.values;
        const category = categories.find(
          (x) => x.directory.toLowerCase() === directory
        );

        const categoryEmbed = new MessageEmbed()
          .setTitle(
            `${emojis[directory]} ${formatString(
              description[directory]
            )} commands`
          )
          .addFields(
            category.commands.map((cmd) => {
              return {
                name: `\`${cmd.name}\``,
                value: cmd.description,
                inline: true,
              };
            })
          )
          .setColor(message.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();

        int.update({ embeds: [categoryEmbed] });
      });

      collector.on("end", () => {
        msg.edit({
          content: `You ran out of time! Do ${client.config.prefix}help again.`,
          components: components(true),
        });
      });
    }
  },
};
