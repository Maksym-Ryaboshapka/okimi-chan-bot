const chromium = require('chromium');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer-core');

(async () => {

  const templatePath = path.join(__dirname, 'userCard.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);

  const cssPath = path.join(__dirname, 'userCard.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  const data = { username: 'MessengerMAX', age: 2 };

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
    // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });


  const element = await page.$('.user-card');
  await element.screenshot({
    path: path.join(__dirname, 'userCard.jpg'),
    type: 'jpeg',
  });

  await browser.close();
  console.log('сохранилась');
})();