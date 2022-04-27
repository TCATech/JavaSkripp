const client = require("../index");
const keepAlive = require("../server");

client.on("ready", () => {
  client.user.setActivity("TCA look cool.", {
    type: "WATCHING",
  });
  console.log(`${client.user.tag} is now online!`);

  keepAlive();
});
