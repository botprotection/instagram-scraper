const puppeteer = require("puppeteer");
const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();

const scrapeProfile = async (username) => {
  let x = new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(`https://www.instagram.com/${username}/`);
    const imgList = await page.evaluate(() => {
      const nodeList = document.querySelectorAll("article img");

      if (nodeList.length === 0) {
        return {
          message:
            "Sorry, this Account is Private, isn't available or may have been removed.",
        };
      }
      const imgArray = [...nodeList];
      const imgList = imgArray.map(({ src }) => ({ src }));
      return imgList;
    });
    await browser.close();
    resolve(imgList);
  });
  return await x;
};

client.on("ready", () => {
  console.log("Bot Online");
  client.user.setActivity("!scrape (username)", { type: "WATCHING" });
});

client.on("message", async (message) => {
  if (message.content.startsWith(`${config.prefix}scrape`)) {
    let username = message.content.split(" ");
    if (username[0] === "!scrape") {
      message.channel.send(`**Scraper Launched**`);
      if (typeof username[1] === "string") {
        message.channel.send(`**Scraping: ${username[1]}**`);
        const imgList = await scrapeProfile(username[1]);
        //const imgList0 = imgList.slice(0, 1);
        // imgList0.map((x) => console.log(x.src))
        imgList.map((x) => {
          message.channel.send(x.src);
        });
      }
    }
  }
});

client.login(config.token);
