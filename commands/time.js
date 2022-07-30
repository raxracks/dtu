const { MessageEmbed } = require("discord.js");
const google = require("googlethis");

const options = {
  page: 0,
  safe: false,
  additional_params: {
    hl: "en",
  },
};

module.exports.onmessage = async function (message, client) {
  const response = await google.search(`time in ${message.content}`, options);
  const time = response?.current_time;

  if (!time) return message.reply("No such location exists!");

  message.channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle(
          `Time in ${
            message.content[0].toUpperCase() +
            message.content.slice(1).toLowerCase()
          }`
        )
        .addFields(
          {
            name: "Time",
            value: time.hours,
            inline: true,
          },
          {
            name: "Date",
            value: time.date,
            inline: true,
          }
        ),
    ],
  });
};

module.exports.description = "Returns the time in the location specified.";
