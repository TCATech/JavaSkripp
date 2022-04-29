const { Client, Message, MessageEmbed } = require("discord.js");
const Docs = require("discord.js-docs");

const branch = "stable";
const max = 1024;

const replaceDisco = (str) =>
  str
    .replace(/docs\/docs\/disco/g, `docs/discord.js/${branch}`)
    .replace(/ \(disco\)/g, "");

module.exports = {
  name: "docs",
  description: "Get some info from the Discord.JS documentation.",
  usage: "<query>",
  aliases: ["doc", "djs"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setColor(client.config.color)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    const query = args.join(" ");

    if (!query)
      return message.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription("You didn't specify a search query. Please do so!")
            .setColor("RED"),
        ],
      });

    const doc = await Docs.fetch(branch);
    const results = await doc.resolveEmbed(query);

    if (!results)
      return message.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription(`No results found for \`${query}\`.`)
            .setColor("RED"),
        ],
      });

    const string = replaceDisco(JSON.stringify(results));
    const docsEmbed = JSON.parse(string);

    docsEmbed.author.url =
      "https://discord.js.org/#/docs/discord.js/stable/general/welcome";
    docsEmbed.author.name = "Discord.JS Docs";

    const extra =
      "\n\nView more here: " +
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        .exec(docsEmbed.description)[0]
        .split(")")[0];

    for (const field of docsEmbed.fields || []) {
      if (field.value.length >= max) {
        field.value = field.value.slice(0, max);
        const split = field.value.split(" ");
        let joined = split.join(" ");

        while (joined.length >= max - extra.length) {
          split.pop();
          joined = split.join(" ");
        }

        field.value = joined + extra;
      }
    }

    if (
      docsEmbed.fields &&
      docsEmbed.fields[docsEmbed.fields.length - 1].value.startsWith(
        "[View source"
      )
    ) {
      docsEmbed.fields.pop();
    }

    return message.reply({
      embeds: [docsEmbed],
    });
  },
};
