import bot from "./bot";

(async (): Promise<void> => {
  await bot.startPolling();
  console.log("Bot is running");
})();
