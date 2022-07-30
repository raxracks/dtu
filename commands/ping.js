<<<<<<< HEAD
const { MessageEmbed } = require("discord.js");

module.exports.onmessage = function (message, client) {
  message.channel.send("Please wait...").then(async (msg) => {
    msg.delete();
    message.channel.send({
      embeds: [
        new MessageEmbed().setTitle("Pong!").addFields(
          {
            name: "Client Latency",
            value: `${msg.createdTimestamp - message.createdTimestamp}ms`,
            inline: true,
          },
          {
            name: "API Latency",
            value: `${Math.round(client.ws.ping)}ms`,
            inline: true,
          }
        ),
      ],
    });
  });
};

module.exports.description = "Returns latency information.";
=======
module.exports.onmessage = function(message, client) {
    message.channel.send("pong");
}
>>>>>>> a141cd72a40cbbef314a03deb5b486a635cc03bb
