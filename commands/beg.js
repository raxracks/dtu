const Discord = require("discord.js");
const { database, getUser } = require("../data/shared.js");

module.exports.onmessage = async function (message, client) {
  let user = await getUser(message.author.id, message.author.tag);

  let amount = Math.floor(Math.random() * 5000) + 5;

  user = await database.updateOne(
    { id: message.author.id },
    { balance: parseInt(user.balance) + amount }
  );

  message.reply(
    `holy fuck shut up just take my money\n\nyou got $${amount}, yay. your new balance is $${user.balance}`
  );

  database.commit();
};

module.exports.description = "Beg for money.";
