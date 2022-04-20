const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Gets the avatar of a user.",
  options: [
    {
      name: "user",
      description: "The user to get the avatar of.",
      type: "USER",
      required: false,
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const { options } = interaction;

    const member = options.getMember("user") || interaction.member;

    const avatar = member.displayAvatarURL({ size: 4096, dynamic: true });

    const embed = new MessageEmbed()
      .setTitle(`Avatar of ${member.user.username}`)
      .setDescription("[Click here to download](" + avatar + ")")
      .setImage(avatar)
      .setColor(client.config.color)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
