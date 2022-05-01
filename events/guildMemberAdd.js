const { MessageEmbed } = require("discord.js");
const client = require("../index");
const { welcomeImage } = require("ultrax");

client.on("guildMemberAdd", async (member) => {
  client.channels.fetch(client.config.channels.guestbook).then((channel) => {
    channel.send({
      content: `<@${member.id}>`,
      embeds: [
        new MessageEmbed()
          .setTitle(`Hello there ${member.user.username}!`)
          .setDescription(
            `Welcome to ${member.guild.name}! Make sure to read the <#${client.config.channels.rules}> and enjoy your stay!`
          )
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setColor(client.config.color)
          .setFooter({
            text: `Welcomer powered by ${client.user.username}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
    });
  });
});
