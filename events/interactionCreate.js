const client = require("../index");
const { MessageEmbed } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    interaction.color = client.config.color;
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("That command no longer exists.")
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
        ephemeral: true,
      });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );

    try {
      cmd.run(client, interaction, args);
    } catch (err) {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh!")
            .setDescription("An error has occured.")
            .addField("Error", err)
            .setColor(client.config.color)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }
  }

  // Context Menu Handling
  if (interaction.isContextMenu()) {
    await interaction.deferReply({ ephemeral: true });
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
});
