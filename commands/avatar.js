<<<<<<< HEAD
const { MessageEmbed } = require("discord.js");

module.exports.onmessage = function (message, client) {
  message.channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle(
          `${
            message?.mentions?.users?.first()?.username ||
            message.author.username
          }'s avatar`
        )
        .setImage(
          message?.mentions?.users
            ?.first()
            ?.avatarURL({ dynamic: true, size: 4096 }) ||
            message.author.avatarURL({ dynamic: true, size: 4096 })
        ),
    ],
  });
};

module.exports.description =
  "Displays your avatar or the mentioned user's avatar.";
=======
const { MessageEmbed } = require('discord.js');

module.exports.onmessage = function(message, client) {
    // Legacy:
    // message.channel.send(message.author.displayAvatarURL({dynamic : true, size : 4096}));

    const avatar = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(message.author.username + "'s avatar")
        .setImage(message.author.displayAvatarURL({dynamic : true, size : 4096}));

    message.channel.send({embeds : [avatar]});
}
>>>>>>> a141cd72a40cbbef314a03deb5b486a635cc03bb
