import TelegramBot from "node-telegram-bot-api";

import config from "./config/index";
import log from "./services/logs/logger.ts";
import onStart from "./bot/commands/start";
import onHelp from "./bot/commands/help";
import onUser from "./bot/commands/user";
import onLink from "./bot/commands/linking/link";
import onUnlink from "./bot/commands/linking/unlink";
import onMe from "./bot/commands/linking/me";
// import onStart from "./bot/commands/start";


if (!config.BOT_TOKEN) {
  log("ERROR", "Failed to launch the bot");
  throw new Error("Bot token not received yet");
}

export const bot = new TelegramBot(config.BOT_TOKEN);
export default bot;

bot.onText(/\/start/, async (msg) => await onStart(bot, msg));
bot.onText(/\/help/, async (msg) => await onHelp(bot, msg));
bot.onText(/\/user(?: (.+))?/, async (msg, match) => await onUser(bot, msg, match));
bot.onText(/\/link(?: (.+))?/, async (msg, match) => await onLink(bot, msg, match));
bot.onText(/\/unlink/, async (msg) => await onUnlink(bot, msg));
bot.onText(/\/me/, async (msg) => await onMe(bot, msg));

const counters: { [key: string]: number } = {};

bot.on('inline_query', async (inlineQuery) => {
  const queryId = inlineQuery.id;
  const queryText = inlineQuery.query.toLowerCase();

  const results: TelegramBot.InlineQueryResultArticle[] = [
    {
      type: 'article',
      id: '1',
      title: `Counter: ${counters[inlineQuery.from.id] || 0}`,
      input_message_content: {
        message_text: `Counter value is ${counters[inlineQuery.from.id] || 0}`
      },
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Increment', callback_data: 'increment' }],
          [{ text: 'Decrement', callback_data: 'decrement' }]
        ]
      },
      description: `Current counter value: ${counters[inlineQuery.from.id] || 0}`,
      thumb_url: 'https://telegram.org/img/t_logo.png'
    },
    {
      type: 'article',
      id: '2',
      title: 'Roll a dice 🎲',
      input_message_content: {
        message_text: `You rolled a dice and got ${Math.floor(Math.random() * 6) + 1}`
      },
      description: 'Roll a virtual dice',
      thumb_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Dice-6.svg'
    },
    {
      type: 'article',
      id: '3',
      title: 'Pick a color',
      input_message_content: {
        message_text: 'Choose a color:',
      },
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Red', callback_data: 'color_red' },
            { text: 'Green', callback_data: 'color_green' },
            { text: 'Blue', callback_data: 'color_blue' }
          ]
        ]
      },
      description: 'Select your favorite color',
      thumb_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Color_icon_blue.svg'
    }
  ];

  await bot.answerInlineQuery(queryId, results);
});

bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  const fromId = callbackQuery.from.id;

  if (!msg) return;

  if (!counters[fromId]) {
    counters[fromId] = 0;
  }

  if (data === 'increment') {
    counters[fromId]++;
    await bot.editMessageText(`Counter value is ${counters[fromId]}`, {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Increment', callback_data: 'increment' }],
          [{ text: 'Decrement', callback_data: 'decrement' }]
        ]
      }
    });
  } else if (data === 'decrement') {
    counters[fromId]--;
    await bot.editMessageText(`Counter value is ${counters[fromId]}`, {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Increment', callback_data: 'increment' }],
          [{ text: 'Decrement', callback_data: 'decrement' }]
        ]
      }
    });
  } else if (data && data.startsWith('color_')) {
    const color = data.split('_')[1];
    await bot.answerCallbackQuery(callbackQuery.id, { text: `You picked ${color}` });
  }

  await bot.answerCallbackQuery(callbackQuery.id);
});

console.log('✅ Bot is running...');
console.log('📝 Enable Inline Mode in @BotFather if you haven\'t!');