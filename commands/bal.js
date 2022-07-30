const Discord = require("discord.js");
const { database, getUser } = require("../data/shared");

module.exports.onmessage = async function (message, client) {
  let user = await getUser(message.author.id, message.author.tag);

  message.reply(`your balance: $${user.balance}`);
};

module.exports.description = "View your balance.";
