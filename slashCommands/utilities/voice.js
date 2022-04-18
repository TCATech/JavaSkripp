const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "voice",
  description: "Control your voice channel.",
  options: [
    {
      name: "invite",
      description: "Invite someone to your voice channel.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to invite.",
          type: "USER",
          required: true,
        },
      ],
    },
    {
      name: "disallow",
      description: "Remove someone's access to your voice Channel.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to invite.",
          type: "USER",
          required: true,
        },
      ],
    },
    {
      name: "allow",
      description: "Allow someone access to your voice channel.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "The user you want to invite.",
          type: "USER",
          required: true,
        },
      ],
    },
    {
      name: "name",
      description: "Change the name of your voice channel.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "text",
          description: "The new name you want to use.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "lock",
      description: "Lock your voice channel, making it so no one can join.",
      type: "SUB_COMMAND",
    },
    {
      name: "unlock",
      description: "Unlock your voice channel, making it so everyone can join.",
      type: "SUB_COMMAND",
    },
  ],
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const { options, member, guild } = interaction;

    const subCommand = options.getSubcommand();
    const voiceChannel = member.voice.channel;
    const ownedChannel = client.voiceGenerator.get(member.id);
    const embed = new MessageEmbed()
      .setTitle("Woo hoo!")
      .setColor(client.config.color)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    if (!voiceChannel)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription(
              "You are not in a voice channel. Try joining <#965503860489728060> to create one."
            )
            .setColor("RED"),
        ],
        ephemeral: true,
      });
    if (!ownedChannel || voiceChannel.id !== ownedChannel)
      return interaction.reply({
        embeds: [
          embed
            .setTitle("Uh oh!")
            .setDescription("You do not own this voice channel.")
            .setColor("RED"),
        ],
        ephemeral: true,
      });

    switch (subCommand) {
      case "name":
        {
          const name = options.getString("text");
          if (name.length > 22)
            return interaction.reply({
              embeds: [
                embed
                  .setTitle("Uh oh!")
                  .setDescription(
                    "You can't have a voice channel name longer than 22 characters."
                  )
                  .setColor("RED"),
              ],
              ephemeral: true,
            });

          voiceChannel.edit({ name });
          interaction.reply({
            embeds: [
              embed.setDescription(
                "I have successfully changed your voice channel name to: " +
                  name +
                  "."
              ),
            ],
            ephemeral: true,
          });
        }
        break;
      case "invite":
        {
          const target = options.getMember("user");
          voiceChannel.permissionOverwrites.edit(target, {
            CONNECT: true,
          });
          try {
            await target.send({
              embeds: [
                embed
                  .setTitle("Hey there!")
                  .setDescription(
                    member.user.tag +
                      " has invited you to join <#" +
                      voiceChannel.id +
                      ">."
                  ),
              ],
            });
            interaction.reply({
              embeds: [
                embed.setDescription(
                  "I have successfully invited " +
                    member.user.tag +
                    "to your voice channel! Now we just need to wait."
                ),
              ],
              ephemeral: true,
            });
          } catch {
            return interaction.reply({
              embeds: [
                embed
                  .setTitle("Uh oh!")
                  .setDescription(
                    "I couldn't DM " +
                      member.user.tag +
                      " because they have their DMs off. Try messaging them yourself."
                  )
                  .setColor("RED"),
              ],
              ephemeral: true,
            });
          }
        }
        break;
      case "disallow":
        {
          const target = options.getMember("user");
          voiceChannel.permissionOverwrites.edit(target, {
            CONNECT: false,
          });

          if (
            target.voice.channel &&
            target.voice.channel.id === voiceChannel.id
          )
            target.voice.setChannel(null);

          interaction.reply({
            embeds: [
              embed.setDescription(
                "I have successfully removed " +
                  member.user.tag +
                  "from your voice channel."
              ),
            ],
            ephemeral: true,
          });
        }
        break;
      case "allow":
        {
          const target = options.getMember("user");
          voiceChannel.permissionOverwrites.edit(target, {
            CONNECT: true,
          });

          interaction.reply({
            embeds: [
              embed.setDescription(
                "I have successfully let " +
                  member.user.tag +
                  "join your voice channel again."
              ),
            ],
            ephemeral: true,
          });
        }
        break;
      case "lock":
        {
          voiceChannel.permissionOverwrites.edit(guild.id, {
            CONNECT: false,
          });
          interaction.reply({
            embeds: [
              embed.setDescription(
                "I have successfully locked your voice channel."
              ),
            ],
            ephemeral: true,
          });
        }
        break;
      case "unlock":
        {
          voiceChannel.permissionOverwrites.edit(guild.id, {
            CONNECT: null,
          });
          interaction.reply({
            embeds: [
              embed.setDescription(
                "I have successfully unlocked your voice channel."
              ),
            ],
            ephemeral: true,
          });
        }
        break;
    }
  },
};
