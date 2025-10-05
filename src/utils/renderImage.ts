import fs from "fs";
import path from "path";
import {v4 as uuid} from "uuid";
// import getChromium from "./getChromium";
import * as handlebars from "handlebars";
import {chromium} from "playwright";
import type ClearUser from "../types/ClearUser.types";

export default async function renderImage(data: ClearUser): Promise<string> {
  const rootPath = path.resolve(__dirname, "..");
  // const chromiumPath = await getChromium();

  const cardId = uuid();
  const templatePath = path.resolve(rootPath, "templates", "userCard.hbs");
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);

  const cssPath = path.resolve(rootPath, "templates", "userCard.css");
  const css = fs.readFileSync(cssPath, "utf8");

  const html = `
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>${css}</style>
      </head>
      <body>
        ${template(data)}
      </body>
    </html>
  `;

  const browser = await chromium.launch({
    // executablePath: chromiumPath,
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-sync",
      "--disable-translate",
      "--disable-popup-blocking",
      "--no-sandbox",
      "--disable-plugins",
      "--disable-logging",
      "--disable-software-rasterizer",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-accelerated-2d-canvas",
      "--disable-dev-shm-usage",
      "--no-zygote",
      "--single-process",
    ],
  });

  const page = await browser.newPage();
  await page.setContent(html, {waitUntil: "networkidle"});

  const element = page.locator(".user-card");
  if (await element.count() > 0) {
    await element.screenshot({
      path: path.resolve(rootPath, "templates", `userCard-${cardId}.jpg`),
      type: "jpeg",
    });
  }

  await browser.close();
  return cardId;
}