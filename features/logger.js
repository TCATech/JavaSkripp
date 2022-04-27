const { Client, MessageEmbed, WebhookClient } = require("discord.js");

const channelTypes = {
  GUILD_TEXT: "Text",
  GUILD_VOICE: "Voice",
  GUILD_CATEGORY: "Category",
  GUILD_NEWS: "Annoucements",
  GUILD_STAGE_VOICE: "Stage",
};

/**
 * @param {Client} client
 */

module.exports = (client) => {
  client
    .on("messageUpdate", (oldMessage, newMessage) => {
      if (oldMessage.author.bot) return;
      send_log(
        client,
        new MessageEmbed()
          .setAuthor({
            name: newMessage.author.tag,
            iconURL: newMessage.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            "**Message edited in <#" +
              newMessage.channel.id +
              ">** | [Jump to message](" +
              newMessage.url +
              ")"
          )
          .addField("Before", oldMessage.content.toString())
          .addField("After", newMessage.content.toString())
      );
    })
    .on("channelCreate", (channel) => {
      send_log(
        client,
        new MessageEmbed()
          .setTitle("Channel created")
          .addField("Name", channel.name.toString())
          .addField("ID", channel.id.toString())
          .addField("Type", channelTypes[channel.type.toString()])
          .setAuthor({
            name: channel.guild.name,
            iconURL: channel.guild.iconURL({ dynamic: true }),
          }),
        "GREEN"
      );
    })
    .on("channelDelete", (channel) => {
      send_log(
        client,
        new MessageEmbed()
          .setTitle("Channel deleted")
          .addField("Name", channel.name.toString())
          .addField("Type", channelTypes[channel.type.toString()])
          .setAuthor({
            name: channel.guild.name,
            iconURL: channel.guild.iconURL({ dynamic: true }),
          }),
        "RED"
      );
    })
    .on("channelUpdate", (oldChannel, newChannel) => {
      if (oldChannel.id === "968821530589003816") return;
      if (oldChannel.name !== newChannel.name) {
        send_log(
          client,
          new MessageEmbed()
            .setTitle("Channel name updated")
            .addField("Before", oldChannel.name.toString())
            .addField("After", newChannel.name.toString())
            .addField("Type", channelTypes[newChannel.type.toString()])
            .setAuthor({
              name: newChannel.guild.name,
              iconURL: newChannel.guild.iconURL({ dynamic: true }),
            }),
          "GREEN"
        );
      } else if (oldChannel.topic !== newChannel.topic) {
        send_log(
          client,
          new MessageEmbed()
            .setTitle("Channel topic updated")
            .addField(
              "Before",
              oldChannel.topic ? oldChannel.topic.toString() : "None"
            )
            .addField(
              "After",
              newChannel.topic ? newChannel.topic.toString() : "None"
            )
            .setAuthor({
              name: newChannel.guild.name,
              iconURL: newChannel.guild.iconURL({ dynamic: true }),
            }),
          "GREEN"
        );
      }
    });
};

async function send_log(c, embed, color) {
  try {
    const LogEmbed = embed
      .setColor(color ? color : c.config.color)
      .setTimestamp()
      .setFooter({
        text: "Powered by " + c.user.username,
        iconURL: c.user.displayAvatarURL({ dynamic: true }),
      });
    const hook = new WebhookClient({
      id: process.env.webhookId,
      token: process.env.webhookToken,
    });
    if (!hook) return TypeError("No webhook found.");
    hook.send({
      username: c.user.username,
      avatarURL: c.user.displayAvatarURL({ dynamic: true }),
      embeds: [LogEmbed],
    });
  } catch (err) {
    console.log(err);
  }
}
