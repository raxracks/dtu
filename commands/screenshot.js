const puppeteer = require("puppeteer");

module.exports.onmessage = async function (message, client) {
  message.channel.sendTyping();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(
    message.content.trim().startsWith("http")
      ? message.content
      : "http://" + message.content
  );

  await page.screenshot({ path: __dirname + "/../screenshots/screenshot.png" });

  message.reply({
    files: [
      {
        attachment: __dirname + "/../screenshots/screenshot.png",
        name: "screenshot.png",
        description: "The screenshot of the URL: " + message.content,
      },
    ],
  });

  await browser.close();
};

module.exports.description = "Sends a screenshot of the provided url.";
