process.env.NTBA_FIX_350 = "true";

import bot from "./bot";
import "./bot/inline/inline";
import { closeBrowser } from "./services/render/renderImage";
import connectDB from "./db";

async function main() {
  await connectDB();
  console.log("✅ DB connected");

  await bot.startPolling();
  console.log("✅ Bot running");

  process.on("SIGINT", closeBrowser);
  process.on("SIGTERM", closeBrowser);
}

main();
