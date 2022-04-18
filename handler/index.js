const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  // Commands
  // const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
  // commandFiles.map((value) => {
  //   const file = require(value);
  //   const splitted = value.split("/");
  //   const directory = splitted[splitted.length - 2];

  //   if (file.name) {
  //     const properties = { directory, ...file };
  //     client.commands.set(file.name, properties);
  //   }
  // });

  // Slash commands
  const slashCommands = await globPromise(
    `${process.cwd()}/slashCommands/*/*.js`
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    client.slashCommands.set(file.name, file);

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    if (file.userPerms) file.defaultPermission = false;
    arrayOfSlashCommands.push(file);
  });
  client.on("ready", async () => {
    // Register for a single guild
    const guild = client.guilds.cache.get(client.config.guild);
    await guild.commands.set(arrayOfSlashCommands).then((cmd) => {
      const getRoles = (commandName) => {
        const permissions = arrayOfSlashCommands.find(
          (x) => x.name === commandName
        ).userPerms;

        if (!permissions) return null;
        return guild.roles.cache.filter(
          (x) => x.permissions.has(permissions) && !x.managed
        );
      };

      const fullPermissions = cmd.reduce((acc, x) => {
        const roles = getRoles(x.name);
        if (!roles) return acc;

        const permissions = roles.reduce((a, v) => {
          return [
            ...a,
            {
              id: v.id,
              type: "ROLE",
              permission: true,
            },
          ];
        }, []);

        return [
          ...acc,
          {
            id: x.id,
            permissions,
          },
        ];
      }, []);

      guild.commands.permissions.set({ fullPermissions });
    });

    // Register for all the guilds the bot is in
    // await client.application.commands.set(arrayOfSlashCommands);
  });

  // Events
  const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
  eventFiles.map((value) => require(value));

  // Features
  const readFeatures = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        readFeatures(path.join(dir, file));
      } else {
        const feature = require(path.join(__dirname, dir, file));
        feature(client);
      }
    }
  };

  readFeatures("../features/");

  // MongoDB
  const mongoURI = process.env.mongoURI;
  if (!mongoURI) return;

  mongoose.connect(mongoURI).then(() => console.log("Connected to MongoDB"));
};
