const fs = require("fs");
const path = require("path");
const {v4: uuid}  = require("uuid");
const getChromiumPath = require("../utils/getChromium");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer-core");

async function renderImage(data) {
  const rootPath = path.join(__dirname, "..");
  const chromiumPath = await getChromiumPath();

  const cardId = uuid();
  const templatePath = path.join(rootPath, "templates", "userCard.hbs");
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);

  const cssPath = path.join(rootPath, "templates", "userCard.css");
  let css = fs.readFileSync(cssPath, "utf8");

  const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>${css}</style>
      </head>
      <body>
        ${template(data)}
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    executablePath: chromiumPath,
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, {waitUntil: "networkidle0"});

  const element = await page.$(".user-card");
  if (element) {
    await element.screenshot({
      path: path.join(rootPath, "templates", `userCard-${cardId}.jpg`),
      type: "jpeg",
    });

    // +----------------------------------------+
    // | тут надо написать отправку фото в боте |
    // +----------------------------------------+

    console.log("сохранилась");
  }

  await browser.close();
  return cardId;
}

module.exports = {renderImage};