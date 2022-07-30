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
  const response = await google.search(message.content, options);

  let embeds = [];

  response.results.forEach((result) => {
    embeds.push(
      new MessageEmbed()
        .setTitle(result.title)
        .setDescription(result.description)
        .setURL(result.url)
        .setThumbnail(result?.favicons?.high_res || result?.favicons?.low_res)
    );
  });

  message.reply({
    embeds: embeds,
  });
};

module.exports.description = "Searches google and returns the results.";
