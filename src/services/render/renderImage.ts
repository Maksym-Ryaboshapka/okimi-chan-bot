import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import * as handlebars from "handlebars";
import { chromium } from "playwright";
import type { Browser } from "playwright";
import type { ClearUser } from "./ClearUser.types.ts";

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    browserInstance = await chromium.launch({
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
        "--disable-font-subpixel-positioning",
      ],
    });
  }
  return browserInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

export default async function renderImage(data: ClearUser): Promise<string> {
  const SCALE = 3;

  const rootPath = path.resolve(__dirname, "..", "..");
  const cardId = uuid();
  const templatePath = path.resolve(rootPath, "templates", "userCard.hbs");
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);
  const cssPath = path.resolve(rootPath, "templates", "userCard.css");
  const css = fs.readFileSync(cssPath, "utf8");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <style>
          ${ css },
          
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            image-rendering: crisp-edges;
            transform: scale(${ SCALE });
            transform-origin: top left;
            width: ${ 680 }px;
            height: ${ 340 }px;
          }
          
          .user-card {
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          
          img {
            image-rendering: crisp-edges;
          }
        </style>
      </head>
      <body>
        ${ template(data) }
      </body>
    </html>
  `;

  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: { width: 680 * SCALE, height: 340 * SCALE },
    deviceScaleFactor: SCALE
  });

  try {
    const page = await context.newPage();
    await page.setContent(html, {
      waitUntil: "networkidle",
    });

    const element = await page.$('.user-card');
    if (element) {
      const screenshotPath = path.resolve(
          rootPath,
          "templates",
          `userCard-${ cardId }.jpg`
      );
      await element.screenshot({
        path: screenshotPath,
        type: "jpeg",
        quality: 95,
        scale: "device",
      });
    }

    return cardId;
  } catch (error) {
    console.error("Error during screenshot:", error);
    throw error;
  } finally {
    await context.close();
  }
}