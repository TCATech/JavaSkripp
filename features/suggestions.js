const { MessageEmbed } = require("discord.js");
const statusMessages = {
  WAITING: {
    text: "📊 Waiting for community feedback, please vote!",
    color: 0xffea00,
  },
  ACCEPTED: {
    text: "✅ Accepted idea! Expect this soon.",
    color: 0x34eb5b,
  },
  DENIED: {
    text: "❌ Thank you for the feedback, but we are not interested in this idea at this time.",
    color: 0xc20808,
  },
};

/**
 * @param {Client} client
 */
module.exports = (client) => {
  client.on("messageCreate", (message) => {
    const { guild, channel, content, member } = message;
    const channelId = client.config.channels.suggestions;
    if (channelId && channelId === channel.id && !member.user.bot) {
      message.delete();

      const status = statusMessages.WAITING;

      const embed = new MessageEmbed()
        .setColor(status.color)
        .setAuthor({
          name: member.user.tag,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(content)
        .addFields({
          name: "Status",
          value: status.text,
        })
        .setFooter({
          text: "Wanna suggest something? Simply type it in this channel!",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });

      channel
        .send({
          embeds: [embed],
        })
        .then((msg) => {
          msg.react("873399554555383849");
          msg.react("873399628500987945");
        });
    }
  });
};

module.exports.statusMessages = statusMessages;
