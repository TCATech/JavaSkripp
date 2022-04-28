const { MessageEmbed } = require("discord.js");
const client = require("../index");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  let { prefix } = client.config;

  if (!message.content.toLowerCase().startsWith(prefix)) return;

  message.color = client.config.color;

  const [cmd, ...args] = message.content.slice(prefix.length).trim().split(" ");

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command) return;

  try {
    if (
      command.userPerms &&
      !message.member.permissions.has(command.userPerms)
    ) {
      const userPermsEmbed = new MessageEmbed()
        .setTitle("Uh oh!")
        .setDescription("You don't have permission to use that command.")
        .setColor(message.color)
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      return message.reply({
        embeds: [userPermsEmbed],
      });
    }

    await command.run(client, message, args);
  } catch (err) {
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Uh oh!")
          .setDescription("An error has occured.")
          .addField("Error", err.toString())
          .setColor(client.config.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
    });
  }
});
