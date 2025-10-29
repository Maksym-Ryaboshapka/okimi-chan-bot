import TelegramBot from "node-telegram-bot-api";
import config from "./config/index";
import { Queries } from "./bot/queries.ts";

import onStart from "./bot/commands/start";
import onUser from "./bot/commands/user";
import onLink from "./bot/commands/linking/link.ts";
import onUnlink from "./bot/commands/linking/unlink.ts";
import onMe from "./bot/commands/linking/me.ts";

import unlinkHandler from "./bot/handlers/unlinkHandler.ts";

if (!config.BOT_TOKEN) {
  throw new Error("Bot token not received yet");
}

const bot = new TelegramBot(config.BOT_TOKEN);
export default bot;

bot.onText(/\/start/, async (msg) => await onStart(bot, msg));

bot.onText(/\/user(?: (.+))?/, async (msg, match) => await onUser(bot, msg, match));

bot.onText(/\/link/, async (msg) => await onLink(bot, msg));
bot.onText(/\/unlink/, async (msg) => await onUnlink(bot, msg));

bot.onText(/\/me/, async (msg) => await onMe(bot, msg));

bot.on("callback_query", async (query) => {
  if (query.data === Queries.Unlink) {
    await unlinkHandler(bot, query);
  } else if (query.data === Queries.Cancel) {
    await bot.answerCallbackQuery(query.id);
  }
});