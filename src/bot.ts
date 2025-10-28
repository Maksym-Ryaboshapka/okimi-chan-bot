import TelegramBot from "node-telegram-bot-api";
import config from "./config/index";

import onStart from "./bot/commands/start";
import onUser from "./bot/commands/user";

if (!config.BOT_TOKEN) {
  throw new Error("Bot token not received yet");
}

const bot = new TelegramBot(config.BOT_TOKEN);
export default bot;

bot.onText(/\/start/, (msg) => onStart(bot, msg));

bot.onText(/\/user(?: (.+))?/, (msg, match) => onUser(bot, msg, match));