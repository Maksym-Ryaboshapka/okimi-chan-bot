import bot from "./bot";
import connectDB from "./db";
import { closeBrowser } from "./services/render/renderImage.ts";

process.env.NTBA_FIX_350 = "true";

connectDB().then(() => {
  console.log("DB connected");
});

bot.startPolling().then(() => {
  console.log("Bot is running");
});

process.on("SIGINT", closeBrowser);
process.on("SIGTERM", closeBrowser);
