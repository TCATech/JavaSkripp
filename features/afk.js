const { MessageEmbed } = require("discord.js");
const model = require("../models/afk");

module.exports = async (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.mentions.members.size) {
      const embed = new MessageEmbed()
        .setColor(client.config.color)
        .setTitle("Hey there!")
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      message.mentions.members.forEach((m) => {
        model.findOne(
          {
            User: m.id,
          },
          async (err, data) => {
            if (err) throw err;
            if (data) {
              embed
                .setDescription(`${m.user.tag} is currently AFK.`)
                .addField("Reason", data.Reason)
                .addField("When they went AFK", `<t:${data.Time}:R>`);

              return message.reply({
                embeds: [embed],
              });
            }
          }
        );
      });
    }
  });
};
