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
  message.attachments.forEach(async (attachment) => {
    const reverse = await google.search(attachment.url, {
      ris: true,
    });

    let embeds = [];

    reverse.results.forEach((result) => {
      embeds.push(
        new MessageEmbed()
          .setTitle(result.title)
          .setDescription(result.description)
          .setURL(result.url)
          .setThumbnail(result?.favicons?.high_res || result?.favicons?.low_res)
      );
    });

    if (embeds.length === 0) return message.reply("No results");
    message.reply({ embeds });
  });
};

module.exports.description = "Reverse image search with google images.";
