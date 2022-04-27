const { VoiceState } = require("discord.js");
const client = require("../index");

client.on("voiceStateUpdate", async (oldState, newState) => {
  const { member, guild } = newState;
  const oldChannel = oldState.channel;
  const newChannel = newState.channel;
  const joinToCreate = client.config.channels.joinToCreate;

  if (
    oldChannel !== newChannel &&
    newChannel &&
    newChannel.id === joinToCreate
  ) {
    const voiceChannel = await guild.channels.create(
      `${member.user.username}'s Room`,
      {
        type: "GUILD_VOICE",
        parent: newChannel.parent,
        position: newChannel.position,
        permissionOverwrites: [
          {
            id: member.id,
            allow: ["CONNECT"],
          },
          {
            id: guild.id,
            allow: ["CONNECT"],
          },
        ],
      }
    );

    client.voiceGenerator.set(member.id, voiceChannel.id);
    await newChannel.permissionOverwrites.edit(member, { CONNECT: false });
    setTimeout(() => newChannel.permissionOverwrites.delete(member), 30 * 1000);

    return setTimeout(() => member.voice.setChannel(voiceChannel), 500);
  }

  const ownedChannel = client.voiceGenerator.get(member.id);

  if (
    ownedChannel &&
    oldChannel.id === ownedChannel &&
    (!newChannel || newChannel.id !== ownedChannel)
  ) {
    client.voiceGenerator.set(member.id, null);
    oldChannel.delete().catch(() => {});
  }
});
