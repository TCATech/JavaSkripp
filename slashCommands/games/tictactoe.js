const { Client, Interaction } = require("discord.js");
const TicTacToe = require("discord-tictactoe");
const game = new TicTacToe({ language: "en" });

module.exports = {
  name: "tictactoe",
  description: "Play TicTacToe against someone else, or with an AI.",
  options: [
    {
      name: "opponent",
      description: "The person you want to defeat.",
      type: "USER",
      required: false,
    },
  ],
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction) => {
    game.handleInteraction(interaction);
  },
};
