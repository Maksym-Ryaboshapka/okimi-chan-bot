import bot from "./bot";
import connectDB from "./db";
import { closeBrowser } from "./services/render/renderImage.ts";
import log from "./services/logs/logger.ts";

connectDB().then(() => {
  console.log("DB connected");
  log("INFO", "DB connected");
});

bot.startPolling().then(() => {
  log("INFO", "Bot is running");
  console.log("Bot is running");
});

process.on("SIGINT", closeBrowser);
process.on("SIGTERM", closeBrowser);
process.on("SIGKILL", closeBrowser);
