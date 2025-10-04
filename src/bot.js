const TelegramBot = require("node-telegram-bot-api");
const {BOT_TOKEN} = require("./config");

const onStart = require("./bot/commands/start");
const onUser = require("./bot/commands/user");

const bot = new TelegramBot(BOT_TOKEN, {polling: false});

bot.onText(/\/start/, (msg) => {
  (async () => {
    await onStart(bot, msg);
  })();
});

bot.onText(/\/user(?: (.+))?/, (msg, match) => {
  (async () => {
    await onUser(bot, msg, match);
  })();
});

module.exports = bot;