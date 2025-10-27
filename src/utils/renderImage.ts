import fs from "fs";
import path from "path";
import {v4 as uuid} from "uuid";
import getChromium from "./getChromium";
import * as handlebars from "handlebars";
import {chromium} from "playwright";
import type { ClearUser } from "../types/ClearUser.types";

export default async function renderImage(data: ClearUser): Promise<string> {
  const rootPath = path.resolve(__dirname, "..");
  const chromiumPath = await getChromium();

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
          ${css}
          
          /* Додаткові стилі для покращення рендерингу */
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
          
          .user-card {
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          
          img {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        </style>
      </head>
      <body>
        ${template(data)}
      </body>
    </html>
  `;

  const browser = await chromium.launch({
    executablePath: chromiumPath,
    headless: true, // Змінити на true для продуктивності
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
      "--font-render-hinting=none", // Покращує рендеринг шрифтів
      "--disable-font-subpixel-positioning",
    ],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 680, height: 340 },
      deviceScaleFactor: 2, // Збільшує роздільну здатність для кращої якості
    });

    const page = await context.newPage();
    
    // Очікування завантаження шрифтів та зображень
    await page.setContent(html, { 
      waitUntil: "networkidle",
      timeout: 10000 
    });

    // Додаткове очікування для стабілізації рендерингу
    await page.waitForTimeout(500);

    // Переконатися, що зображення завантажилось
    await page.waitForSelector('.pfp', { timeout: 5000 });

    const element = await page.$('.user-card');
    if (element) {
      const screenshotPath = path.resolve(rootPath, "templates", `userCard-${cardId}.jpg`);
      
      await element.screenshot({
        path: screenshotPath,
        type: "jpeg",
        quality: 95,
        scale: "device",
      });

      console.log(`Screenshot saved: ${screenshotPath}`);
    } else {
      throw new Error("Element .user-card not found");
    }

    return cardId;
  } catch (error) {
    console.error("Error during screenshot:", error);
    throw error;
  } finally {
    await browser.close();
  }
}