import TelegramBot from "node-telegram-bot-api";
import onStart from "../../bot/commands/start";
import onHelp from "../../bot/commands/help";
import onUser from "../../bot/commands/user";
import onLink from "../../bot/commands/linking/link";
import onUnlink from "../../bot/commands/linking/unlink";
import onMe from "../../bot/commands/linking/me";
import bot from "../../bot";

import getUser from "../../services/osu/getUser";
import renderImage from "../../services/render/renderImage.ts";
import createData from "../../services/render/createData.ts";

// const TOKEN = '8264275218:AAHvaLVcCNRBsbDN-LOf1ouIc7pVaNu3UaU';
// const bot = new TelegramBot(TOKEN, { polling: true });

// bot.onText(/\/start/, async (msg) => await onStart(bot, msg));
// bot.onText(/\/help/, async (msg) => await onHelp(bot, msg));

// bot.onText(/\/user(?: (.+))?/, async (msg, match) => await onUser(bot, msg, match));

// bot.onText(/\/link(?: (.+))?/, async (msg, match) => await onLink(bot, msg, match));
// bot.onText(/\/unlink/, async (msg) => await onUnlink(bot, msg));
// bot.onText(/\/me/, async (msg) => await onMe(bot, msg));

// Store counter for each inline message
// const counters: Record<string, number> = {};
bot.on("inline_query", async (query: TelegramBot.InlineQuery) => {
  const username = query.query.trim(); // текст после @botname

  if (!username) {
    const results: TelegramBot.InlineQueryResultArticle[] = [
      {
        type: "article",
        id: "1",
        title: "Search user",
        description: "Write a username to search for",
        input_message_content: {
          message_text: "Please provide a username after @botname",
        },
      },
    ];

    await bot.answerInlineQuery(query.id, results, { cache_time: 0 });
    return;
  }

  // Получаем данные пользователя osu!
  const user = await getUser(username);

  if (!user) {
    const results: TelegramBot.InlineQueryResultArticle[] = [
      {
        type: "article",
        id: "1",
        title: `User ${username} not found`,
        input_message_content: {
          message_text: `Пользователь *${username}* не найден`,
          parse_mode: "Markdown", 
        },
      },
    ];

    await bot.answerInlineQuery(query.id, results, { cache_time: 0 });
    return;
  }

  // Создаем карточку
  const data = createData(user);
  const cardId = await renderImage(data);

  const results: TelegramBot.InlineQueryResultArticle[] = [
    {
      type: "article",
      id: "1",
      title: user.username,
      description: `OSU! stats of ${user.username}`,
      input_message_content: {
        message_text: `[OSU! Profile](${cardId})`,
        parse_mode: "Markdown",
      },
      thumb_url: cardId, // если renderImage возвращает ссылку на изображение
    },
  ];

  await bot.answerInlineQuery(query.id, results, { cache_time: 0 });
});
