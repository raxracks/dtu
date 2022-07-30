const Discord = require("discord.js");

module.exports.onmessage = function (message, client) {
  message.content = message.content.split("```").join("");

  if (message.author.id !== "141012665504890880")
    return message.reply("stfu cuck");

  try {
    message.channel.send(
      `\`\`\`${JSON.stringify(eval(message.content))}\`\`\``
    );
  } catch (e) {
    message.channel.send(`\`\`\`${e}\`\`\``);
  }
};
