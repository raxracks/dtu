const puppeteer = require("puppeteer");

module.exports.onmessage = async function (message, client) {
  message.channel.sendTyping();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(`https://www.google.com/search?q=${message.content}`);
  await page.screenshot({
    path: __dirname + "/../screenshots/gscreenshot.png",
  });

  message.reply({
    files: [
      {
        attachment: __dirname + "/../screenshots/gscreenshot.png",
        name: "gscreenshot.png",
        description: "The screenshot of the google query: " + message.content,
      },
    ],
  });

  await browser.close();
};

module.exports.description = "Searches google and returns a screenshot.";
