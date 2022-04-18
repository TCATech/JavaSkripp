const client = require("../index");
const keepAlive = require("../server");

client.on("ready", () => {
  client.user.setActivity("for Graphify", {
    type: "STREAMING",
    url: "https://www.youtube.com/watch?v=1ZQT46APq3s",
  });
  console.log(`${client.user.tag} is now online!`);

  keepAlive();
});
