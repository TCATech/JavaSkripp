const simplydjs = require("simply-djs");

module.exports = {
  name: "calculator",
  description: "Calculate some stuff, in Discord!",
  run: async (client, interaction) => {
    await interaction.deferReply();
    simplydjs.calculator(interaction, {
      slash: true,
      embedColor: client.config.color,
      credit: true,
    });
  },
};
