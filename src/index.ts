import bot from "./bot";
import { closeBrowser } from "./services/render/renderImage.ts";

await bot.startPolling();
console.log("Bot is running");

process.on("SIGINT", closeBrowser);
process.on("SIGTERM", closeBrowser);
process.on("SIGKILL", closeBrowser);
