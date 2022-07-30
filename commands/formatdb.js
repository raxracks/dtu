const Discord = require("discord.js");
const { database } = require("../data/shared.js");

module.exports.onmessage = async function (message, client) {
  if (message.author.id !== "141012665504890880")
    return message.reply("stfu cuck");

  database.format().read();

  message.reply("Formatted database");
};
