const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "purge",
  description: "Purges a number of messages from a channel.",
  userPerms: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "amount",
      description: "The amount of messages you want to purge.",
      type: "NUMBER",
      required: true,
    },
    {
      name: "user",
      description: "The user you want to purge the messages from.",
      type: "USER",
      required: false,
    },
  ],
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async (client, interaction) => {
    const { channel, options } = interaction;

    const amount = options.getNumber("amount");
    const user = options.getMember("user");

    const messages = await channel.messages.fetch();

    const embed = new MessageEmbed()
      .setColor(client.config.color)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    if (amount > 100)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription("You can only purge up to 100 messages at a time."),
        ],
      });

    if (user) {
      let i = 0;
      const filtered = [];
      (await messages).filter((m) => {
        if (m.author.id === user.id && amount > i) {
          filtered.push(m);
          i++;
        }
      });

      await channel.bulkDelete(filtered, true).then((messages) => {
        embed
          .setTitle("Perfect!")
          .setDescription(
            "I have successfully deleted `" +
              messages.size +
              "` messages from " +
              user.user.tag +
              "."
          );
        interaction.reply({
          embeds: [embed],
        });
      });
    } else {
      await channel.bulkDelete(amount, true).then((messages) => {
        embed
          .setTitle("Perfect!")
          .setDescription(
            "I have successfully deleted `" +
              messages.size +
              "` messages from this channel."
          );
        interaction.reply({
          embeds: [embed],
        });
      });
    }
  },
};
