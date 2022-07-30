const Discord = require("discord.js");
const config = require("./config.json");
<<<<<<< HEAD

=======
>>>>>>> a141cd72a40cbbef314a03deb5b486a635cc03bb
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
<<<<<<< HEAD
  ],
});

const fs = require("fs");
let commands = [];

client.on("ready", () =>
  fs
    .readdirSync("./commands")
    .forEach((command) => commands.push(command.split(".js")[0]))
);

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0].slice(config.prefix.length);

  if (commands.includes(command.toLowerCase())) {
    message.content = message.content.slice(
      config.prefix.length + command.length + 1
    );

    try {
      require(`./commands/${command}.js`).onmessage(
        message,
        client,
        config,
        commands
      );
    } catch (e) {
      message.reply("An error has occured: " + e);
    }
  }
});

=======
    ]   
});

// Command Handler
const fs = require('fs');
let commands = {};

client.on('ready', () => fs.readdirSync('./commands').forEach(command => commands[command.split(".js")[0]] = command));

client.on('messageCreate', (message) => {
    let command = message.content.split(' ')[0]

    if(commands[command]) {

        // SUCKS:
        // require(`./commands/${commands[command]}`).onmessage(message, client);

        try {
            require(`./commands/${commands[command]}`).onmessage(message, client);
        } catch (e) {
            console.log("An error has occured: " + e);
        }
    }

    // Log messages in console
    console.log(message);

});


// On start-up
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`you.`, {
        type: "WATCHING",
      });
});

>>>>>>> a141cd72a40cbbef314a03deb5b486a635cc03bb
client.login(config.token);
