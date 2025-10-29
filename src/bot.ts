import TelegramBot from "node-telegram-bot-api";
import config from "./config/index";

import onStart from "./bot/commands/start";
import onHelp from "./bot/commands/help.ts";
import onUser from "./bot/commands/user";
import onLink from "./bot/commands/linking/link.ts";
import onUnlink from "./bot/commands/linking/unlink.ts";
import onMe from "./bot/commands/linking/me.ts";

if (!config.BOT_TOKEN) {
  throw new Error("Bot token not received yet");
}

const bot = new TelegramBot(config.BOT_TOKEN);
export default bot;

bot.onText(/\/start/, async (msg) => await onStart(bot, msg));

bot.onText(/\/help/, async (msg) => await onHelp(bot, msg));

bot.onText(/\/user(?: (.+))?/, async (msg, match) => await onUser(bot, msg, match));

bot.onText(/\/link(?: (.+))?/, async (msg, match) => await onLink(bot, msg, match));
bot.onText(/\/unlink/, async (msg) => await onUnlink(bot, msg));

bot.onText(/\/me/, async (msg) => await onMe(bot, msg));