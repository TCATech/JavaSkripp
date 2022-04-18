const { MessageEmbed } = require("discord.js");
const client = require("../index");

client.on("guildMemberRemove", async (member) => {
  client.channels.fetch(client.config.channels.guestbook).then((channel) => {
    channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Oh no... ${member.user.username} left D:`)
          .setDescription(`I hope they come back!`)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setColor(client.config.color)
          .setFooter({
            text: `Leaver powered by ${client.user.username}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
    });
  });
});
