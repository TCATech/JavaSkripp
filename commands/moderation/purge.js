const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "purge",
  description: "Purges a number of messages from a channel.",
  usage: "<user> [reason]",
  userPerms: ["MANAGE_MESSAGES"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const { channel } = message;

    const amount = args[0];

    const messages = await channel.messages.fetch();

    const embed = new MessageEmbed()
      .setColor(client.config.color)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    if (!amount)
      return message.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription(
              "You didn't mention a number of messages to purge. Please do so!"
            ),
        ],
      });

    if (isNaN(amount))
      return message.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription(
              "You didn't mention a **number** of messages to purge. Please do so!"
            ),
        ],
      });

    if (amount > 100)
      return message.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription("You can only purge up to 100 messages at a time."),
        ],
      });

    await channel.bulkDelete(amount, true).then((messages) => {
      embed
        .setTitle("Perfect!")
        .setDescription(
          "I have successfully deleted `" +
            messages.size +
            "` messages from this channel."
        );
      message.reply({
        embeds: [embed],
      });
    });
  },
};
