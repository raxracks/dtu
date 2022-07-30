const { MessageEmbed } = require("discord.js");
const { cpuTemperature, osInfo } = require("systeminformation");
const pm2 = require("pm2");

let cpuTemp = { max: "Not yet available" };

setInterval(async () => {
  cpuTemperature().then((data) => {
    cpuTemp = data;
  });
}, 30000);

let osinfo = undefined;

module.exports.onmessage = async function (message, client) {
  let x = client.uptime / 1000;
  seconds = Math.floor(x % 60);
  x /= 60;
  minutes = Math.floor(x % 60);
  x /= 60;
  hours = Math.floor(x % 24);
  x /= 24;
  days = Math.floor(x);

  if (!osinfo) osinfo = await osInfo();

  message.reply({
    embeds: [
      new MessageEmbed().setTitle("Info").addFields(
        {
          name: "Uptime",
          value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          inline: true,
        },
        {
          name: "Guilds",
          value: client.guilds.cache.size.toString(),
          inline: true,
        },
        {
          name: "CPU Temperature",
          value: `${cpuTemp.max}°C`,
          inline: true,
        },
        {
          name: "OS",
          value: `${osinfo.distro} ${osinfo.arch} build ${osinfo.build} (${
            osinfo.uefi ? "UEFI" : "Legacy"
          })`,
        }
      ),
    ],
  });
};

module.exports.description = "Displays info about the bot.";
