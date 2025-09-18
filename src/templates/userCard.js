const chromium = require("chromium");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer-core");

async function renderImage(data) {
  // Абсолютный путь до корня проекта
  const rootPath = path.join(__dirname, "..");

  const templatePath = path.join(rootPath, "templates", "userCard.hbs");
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);

  const cssPath = path.join(rootPath, "templates", "userCard.css");
  const css = fs.readFileSync(cssPath, "utf8");

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
    executablePath: chromium.path,
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const element = await page.$(".user-card");
  if (element) {
    await element.screenshot({
      path: path.join(rootPath, "templates", "userCard.jpg"),
      type: "jpeg",
    });
    console.log("сохранилась");
  } else {
    console.log("элемент .user-card не найден");
  }

  await browser.close();
}

module.exports = { renderImage };
