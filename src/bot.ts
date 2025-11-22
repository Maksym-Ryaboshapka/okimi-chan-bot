import TelegramBot from "node-telegram-bot-api";
import config from "./config/index";
import log from "./services/logs/logger";
import onStart from "./bot/commands/start";
import onHelp from "./bot/commands/help";
import onUser from "./bot/commands/user";
import onLink from "./bot/commands/linking/link";
import onUnlink from "./bot/commands/linking/unlink";
import onMe from "./bot/commands/linking/me";

if (!config.BOT_TOKEN) {
  log("ERROR", "No bot token");
  throw new Error("No bot token");
}

export const bot = new TelegramBot(config.BOT_TOKEN, { polling: false });
export default bot;

// Лог chat_id для настройки CACHE_CHAT_ID
// bot.on("message", (msg) => {
//   console.log(`💬 Chat ID: ${msg.chat.id} | Type: ${msg.chat.type} | Title: ${msg.chat.title || msg.chat.username || "DM"}`);
// });


bot.onText(/\/start/, async (msg) => await onStart(bot, msg));
bot.onText(/\/help/, async (msg) => await onHelp(bot, msg));
bot.onText(/\/user(?: (.+))?/, async (msg, match) => await onUser(bot, msg, match));
bot.onText(/\/link(?: (.+))?/, async (msg, match) => await onLink(bot, msg, match));
bot.onText(/\/unlink/, async (msg) => await onUnlink(bot, msg));
bot.onText(/\/me/, async (msg) => await onMe(bot, msg));