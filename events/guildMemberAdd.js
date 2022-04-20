const { MessageEmbed } = require("discord.js");
const client = require("../index");
const { welcomeImage } = require("ultrax");

client.on("guildMemberAdd", async (member) => {
  const bg =
    "https://media.discordapp.net/attachments/965816962062110743/966324282344996924/cool_woodlands_thing_ig_but_with_dark_bg.png";
  const avatar = member.user.displayAvatarURL({ format: "png" });
  const options = {
    attachmentName: `welcome-${member.id}`,
    text1_fontSize: 80,
    text2_fontSize: 50,
    text3_fontSize: 30,
  };
  const image = await welcomeImage(
    bg,
    avatar,
    "Welcome",
    member.user.tag,
    `You are member #${member.guild.memberCount}`,
    "#ffffff",
    options
  );
  client.channels.fetch(client.config.channels.guestbook).then((channel) => {
    channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Hello there ${member.user.username}!`)
          .setDescription(
            `Welcome to ${member.guild.name}! Make sure to read the <#${client.config.channels.rules}> and enjoy your stay!`
          )
          .setImage(`attachment://${options.attachmentName}.png`)
          .setColor(client.config.color)
          .setFooter({
            text: `Welcomer powered by ${client.user.username}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
      files: [image],
    });
  });
});
