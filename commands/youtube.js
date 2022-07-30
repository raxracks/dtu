const puppeteer = require("puppeteer");

module.exports.onmessage = async function (message, client) {
  message.channel.sendTyping();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(
    `https://www.youtube.com/results?search_query=${message.content}`
  );
  await page.screenshot({
    path: __dirname + "/../screenshots/ytscreenshot.png",
  });

  message.reply({
    files: [
      {
        attachment: __dirname + "/../screenshots/ytscreenshot.png",
        name: "ytscreenshot.png",
        description: "The screenshot of the youtube query: " + message.content,
      },
    ],
  });

  await browser.close();
};

module.exports.description = "Searches YouTube and returns a screenshot.";
