const puppeteer = require("puppeteer");

module.exports.onmessage = async function (message, client) {
  message.channel.sendTyping();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(
    `http://www.gizoogle.net/index.php?search=${message.content}&se=Gizoogle+Dis+Shiznit`
  );
  await page.screenshot({
    path: __dirname + "/../screenshots/jscreenshot.png",
  });

  message.reply({
    files: [
      {
        attachment: __dirname + "/../screenshots/jscreenshot.png",
        name: "jscreenshot.png",
        description: "The screenshot of the google query: " + message.content,
      },
    ],
  });

  await browser.close();
};

module.exports.description = "Searches jive google and returns a screenshot.";
