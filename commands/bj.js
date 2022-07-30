const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { database, getUser } = require("../data/shared.js");

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
function getDeck() {
  let deck = new Array();

  for (let i = 0; i < suits.length; i++) {
    for (let x = 0; x < values.length; x++) {
      let card = { value: values[x], suit: suits[i] };
      deck.push(card);
    }
  }

  return deck;
}

function determineBest(hand) {
  let value = 0;

  for (let i = 0; i < hand.length; i++) {
    value += getValue(hand[i].value, hand, true);
  }

  if (value > 10) return 1;
  return 11;
}

function getValue(card, hand, ignoreAce) {
  switch (card) {
    case "J":
    case "K":
    case "Q":
      return 10;
    case "A":
      if (ignoreAce) return 0;
      return determineBest(hand);

    default:
      return +card;
  }
}

function checkBust(hand) {
  let value = 0;

  for (let i = 0; i < hand.length; i++) {
    value += getValue(hand[i].value, hand);
  }

  return value > 21;
}

function getHandValue(hand) {
  let value = 0;

  for (let i = 0; i < hand.length; i++) {
    value += getValue(hand[i].value, hand);
  }

  return value;
}

function checkWin(game, hand) {
  let value = getHandValue(hand);

  let dealerValue = getHandValue(game.dealer);

  return (
    (dealerValue < value && value <= 21) || (dealerValue > 21 && value <= 21)
  );
}

function checkTie(game, hand) {
  let value = getHandValue(hand);

  let dealerValue = getHandValue(game.dealer);

  return dealerValue === value;
}

function dealerPlay(id) {
  let dealerHand = games[id].dealer;
  let dealerValue = getHandValue(dealerHand);

  if (dealerValue >= 21) return;
  while (dealerValue < 17) {
    dealerHand.push(games[id].deck.pop());
    dealerValue = getHandValue(dealerHand);
  }

  games[id].dealer = dealerHand;
}

let games = {};

function shfl(array) {
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

function shuffle(array) {
  for (let i = 0; i < Math.floor(Math.random() * 10) + 1; i++) {
    array = shfl(array);
  }

  return array;
}

let firstRun = true;

module.exports.onmessage = async function (message, client) {
  games[message.author.id] = {};

  let deck = shuffle(getDeck());

  let hand = [deck.pop(), deck.pop()];
  let dealer = [deck.pop(), deck.pop()];

  let bet = +Math.floor(message.content) || 1;

  let usr = await getUser(message.author.id, message.author.tag);

  if (bet > +usr.balance)
    return message.reply("no bitches (you dont have enough money)");
  if (bet < 1) return message.reply("no");

  games[message.author.id] = {
    deck,
    hand,
    dealer,
    bet,
  };

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`HIT-${message.author.id}`)
      .setLabel("Hit")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId(`STAND-${message.author.id}`)
      .setLabel("Stand")
      .setStyle("SECONDARY")
  );

  message.reply({
    embeds: [
      new MessageEmbed({
        footer: { text: `Bet: $${games[message.author.id].bet}` },
      })
        .setTitle("Blackjack")
        .addField("Dealer Hand", `${dealer[0].value}:${dealer[0].suit}:   ???`)
        .addField(
          `Your Hand [${getHandValue(games[message.author.id].hand)}]`,
          hand.map((value, _) => `${value.value}:${value.suit}:`).join("   ")
        ),
    ],
    components: [row],
  });

  if (firstRun) {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;

      if (interaction.customId.startsWith("HIT")) {
        let id = interaction.customId.split("HIT-")[1];
        if (interaction.user.id !== id) return;

        games[id].hand.push(games[id].deck.pop());

        if (checkBust(games[id].hand)) {
          dealerPlay(id);

          let user = await database.findOne({ id: message.author.id });

          if (!user) {
            user = await database.create("user", { id: message.author.id });
          }

          user = await database.updateOne(
            { id: message.author.id },
            { balance: +Math.floor(user.balance) - games[id].bet }
          );

          database.commit();

          return interaction.update({
            embeds: [
              new MessageEmbed({ footer: { text: `Bet: $${games[id].bet}` } })
                .setTitle("Blackjack - Bust")
                .addField(
                  `Dealer Hand [${getHandValue(games[id].dealer)}]`,
                  games[id].dealer
                    .map((value, _) => `${value.value}:${value.suit}:`)
                    .join("   ")
                )
                .addField(
                  `Your Hand [${getHandValue(games[id].hand)}]`,
                  games[id].hand
                    .map((value, _) => `${value.value}:${value.suit}:`)
                    .join("   ")
                )
                .setColor("#ff0008"),
            ],
            components: [],
          });
        }

        interaction.update({
          embeds: [
            new MessageEmbed({ footer: { text: `Bet: $${games[id].bet}` } })
              .setTitle("Blackjack")
              .addField(
                "Dealer Hand",
                `${games[id].dealer[0].value}:${games[id].dealer[0].suit}:   ???`
              )
              .addField(
                `Your Hand [${getHandValue(games[id].hand)}]`,
                games[id].hand
                  .map((value, _) => `${value.value}:${value.suit}:`)
                  .join("   ")
              ),
          ],
        });
      } else if (interaction.customId.startsWith("STAND")) {
        let id = interaction.customId.split("STAND-")[1];
        if (interaction.user.id !== id) return;

        let game = games[id];

        let color = "#ff0008";
        dealerPlay(id);
        if (checkWin(games[id], games[id].hand, false)) {
          color = "#00ff1a";
          let user = await database.findOne({ id: message.author.id });

          if (!user) {
            user = await database.create("user", { id: message.author.id });
          }

          user = await database.updateOne(
            { id: message.author.id },
            { balance: +Math.floor(user.balance) + games[id].bet }
          );

          database.commit();
        } else if (!checkTie(games[id], games[id].hand, false)) {
          let user = await database.findOne({ id: message.author.id });

          if (!user) {
            user = await database.create("user", { id: message.author.id });
          }

          user = await database.updateOne(
            { id: message.author.id },
            { balance: +Math.floor(user.balance) - games[id].bet }
          );

          database.commit();
        } else {
          color = "#0866ff";
        }

        interaction.update({
          embeds: [
            new MessageEmbed({ footer: { text: `Bet: $${games[id].bet}` } })
              .setTitle(
                `Blackjack - ${
                  color === "#ff0008"
                    ? "Lost"
                    : color === "#0866ff"
                    ? "Tie"
                    : "Won"
                }`
              )
              .addField(
                `Dealer Hand [${getHandValue(games[id].dealer)}]`,
                games[id].dealer
                  .map((value, _) => `${value.value}:${value.suit}:`)
                  .join("   ")
              )
              .addField(
                `Your Hand [${getHandValue(games[id].hand)}]`,
                games[id].hand
                  .map((value, _) => `${value.value}:${value.suit}:`)
                  .join("   ")
              )
              .setColor(color),
          ],
          components: [],
        });
      }
    });
  }

  firstRun = false;
};

module.exports.description = "Play blackjack.";
