const { Client, Message, MessageEmbed } = require("discord.js");
const emojis = require("../../emojis.json");
const statuses = {
  online: `${emojis.online} \`Online\``,
  idle: `${emojis.idle} \`AFK\``,
  offline: `${emojis.offline} \`Offline\``,
  dnd: `${emojis.dnd} \`Do Not Disturb\``,
};
const flags = {
  DISCORD_EMPLOYEE: `${emojis.discord_employee} \`Discord Employee\``,
  DISCORD_PARTNER: `${emojis.discord_partner} \`Partnered Server Owner\``,
  BUGHUNTER_LEVEL_1: `${emojis.bughunter_level_1} \`Bug Hunter (Level 1)\``,
  BUGHUNTER_LEVEL_2: `${emojis.bughunter_level_2} \`Bug Hunter (Level 2)\``,
  HYPESQUAD_EVENTS: `${emojis.hypesquad_events} \`HypeSquad Events\``,
  HOUSE_BRAVERY: `${emojis.house_bravery} \`House of Bravery\``,
  HOUSE_BRILLIANCE: `${emojis.house_brilliance} \`House of Brilliance\``,
  HOUSE_BALANCE: `${emojis.house_balance} \`House of Balance\``,
  EARLY_SUPPORTER: `${emojis.early_supporter} \`Early Supporter\``,
  TEAM_USER: "Team User",
  SYSTEM: "System",
  VERIFIED_BOT: `${emojis.verified_bot} \`Verified Bot\``,
  VERIFIED_DEVELOPER: `${emojis.verified_developer} \`Early Verified Bot Developer\``,
};

module.exports = {
  name: "userinfo",
  description: "Get some info about a user.",
  usage: "[user]",
  /**
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const userFlags = (await member.user.fetchFlags()).toArray();

    const embed = new MessageEmbed()
      .setColor(client.config.color)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTitle("Some information about " + member.user.username)
      .addFields(
        {
          name: "User",
          value: `<@${member.id}>`,
          inline: true,
        },
        {
          name: "Discriminator",
          value: "`#" + member.user.discriminator + "`",
          inline: true,
        },
        {
          name: "ID",
          value: "`" + member.id + "`",
          inline: true,
        },
        {
          name: "Bot",
          value: member.user.bot ? "`Yes`" : "`No`",
          inline: true,
        },
        {
          name: "Joined server",
          value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Joined Discord",
          value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Highest Role",
          value: member.roles.highest.toString(),
          inline: true,
        }
      );

    if (userFlags.length > 0)
      embed.addField("Badges", userFlags.map((flag) => flags[flag]).join("\n"));

    message.reply({
      embeds: [embed],
    });
  },
};
