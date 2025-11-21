process.env.NTBA_FIX_350 = "true";

import bot from "./bot";
import "./bot/inline/inline";
import { closeBrowser } from "./services/render/renderImage";

bot.startPolling();
console.log("✅ Bot running");

process.on("SIGINT", closeBrowser);
process.on("SIGTERM", closeBrowser);