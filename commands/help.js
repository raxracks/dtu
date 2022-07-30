const { MessageEmbed } = require("discord.js");

module.exports.onmessage = async function (message, client, _, commands) {
  const embed = new MessageEmbed({
    footer: { text: "The commands are case sensitive." },
  }).setTitle("Help");

  commands.forEach((command) => {
    let description = require(`./${command}`).description;
    if (!!description) embed.addField(command, description);
  });

  message.reply({ embeds: [embed] });
};

module.exports.description = "Shows this menu.";
