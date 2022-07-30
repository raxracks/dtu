const { MessageEmbed } = require("discord.js");
const { database } = require("../data/shared");

module.exports.onmessage = async function (message, client) {
  const embed = new MessageEmbed().setTitle("Global Leaderboard");

  let data = (await database.find({})).sort((a, b) => +b.balance - +a.balance);

  await message.guild.members.fetch();

  for (const user of data) {
    if (message.guild.members.cache.get(user.id)) {
      embed.addField(
        message.guild.members.cache.get(user.id).user.tag,
        `$${user.balance}`
      );
    } else {
      embed.addField(data?.tag || "Unknown User", `$${user.balance}`);
    }
  }

  message.channel.send({ embeds: [embed] });
};

module.exports.description = "View the balance leaderboard.";
