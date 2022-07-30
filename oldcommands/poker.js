const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const suits = ["spades", "diamonds", "clubs", "hearts"];
const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

let lobbies = {};
let firstRun = true;

function generateEmbed(lobby) {
  return new MessageEmbed().setTitle("Poker").addFields({
    name: "Players",
    value: lobby.players.size.toString(),
    inline: true,
  });
}

function generateID(length) {
  return new Array(length)
    .fill("")
    .map((_, idx) =>
      idx % Math.floor(Math.random() * 5) == 0
        ? String.fromCharCode(97 + Math.floor(Math.random() * 26))
        : Math.floor(Math.random() * 9)
    )
    .join("");
}

function getDeck() {
  let deck = new Array();

  for (let i = 0; i < suits.length; i++) {
    for (let x = 0; x < values.length; x++) {
      let card = { Value: values[x], Suit: suits[i] };
      deck.push(card);
    }
  }

  return deck;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function play(lobby) {
  broadcast("The poker game is now starting!", lobby);

  lobby.players = shuffle(Array.from(lobby.players));

  let deck = shuffle(getDeck());

  lobby.players.forEach((player) => {
    player.hand = [deck.pop(), deck.pop()];

    let parsedHand = [];

    player.hand.forEach((card) => {
      parsedHand.push(
        `${
          isNaN(parseInt(card.Value))
            ? `:regional_indicator_${card.Value.toLowerCase()}:`
            : card.Value
        }:${card.Suit}:`
      );
    });

    player.send({
      embeds: [
        new MessageEmbed()
          .setTitle("Game State")
          .addField("Hand", parsedHand.join("    ")),
      ],
    });
  });
}

function broadcast(message, lobby, blacklist = []) {
  lobby.players.forEach((player) => {
    player.send(message);
  });
}

module.exports.onmessage = function (message, client) {
  let id = generateID(6);

  lobbies[id] = {
    players: new Set().add(message.author),
    host: message.author.id,
  };

  const row = new MessageActionRow().addComponents(
    new MessageButton().setCustomId(id).setLabel("Join").setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId(`start-${id}`)
      .setLabel("Start")
      .setStyle("SECONDARY")
  );

  message.reply({
    embeds: [generateEmbed(lobbies[id])],
    components: [row],
  });

  if (firstRun) {
    client.on("interactionCreate", (interaction) => {
      if (!interaction.isButton()) return;

      if (!interaction.customId.startsWith("start-")) {
        lobbies[interaction.customId].players.add(interaction.user);
        interaction.message.edit({
          embeds: [generateEmbed(lobbies[interaction.customId])],
        });

        interaction.deferUpdate();
      } else {
        let id = interaction.customId.split("start-")[1];

        if (interaction.user.id !== lobbies[id].host) return;

        interaction.message.edit({
          content: "This game has started.",
          components: [],
        });

        play(lobbies[id]);
      }
    });
  }

  firstRun = false;
};

module.exports.description = "Starts a poker match.";
