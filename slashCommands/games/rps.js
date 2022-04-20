const simplydjs = require("simply-djs");

module.exports = {
  name: "rps",
  description: "Play Rock, Paper, Scissors with someone else, or with an AI.",
  options: [
    {
      name: "user",
      type: "USER",
      description: "The person you want to compete against.",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();
    simplydjs.rps(interaction, {
      slash: true,
      embedColor: client.config.color,
    });
  },
};
