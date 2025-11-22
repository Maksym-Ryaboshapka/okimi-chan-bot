import TelegramBot from "node-telegram-bot-api";
import bot from "../../bot";
import getUser from "../../services/osu/getUser";
import createData from "../../services/render/createData";
import renderImage from "../../services/render/renderImage";
import path from "path";
import fs from "fs";
import config from "../../config";
import log from "../../services/logs/logger.ts";

if (!config.CACHE_CHAT_ID) {
  log("ERROR", "Failed to get cache group id");
  throw new Error("Cache group id not received yet");
}

const CACHE_CHAT_ID = config.CACHE_CHAT_ID;

bot.on("inline_query", async (query) => {
  const username = query.query.trim();

  if (!username) {
    return bot.answerInlineQuery(query.id, [{
      type: "article",
      id: "help",
      title: "Поиск osu! игрока",
      description: "Введи ник после",
      input_message_content: { message_text: "Введи ник osu! игрока" },
    }]);
  }

  const user = await getUser(username);

  if (!user) {
    return bot.answerInlineQuery(query.id, [{
      type: "article",
      id: "notfound",
      title: "Не найден",
      input_message_content: {
        message_text: `Игрок *${ username }* не найден`,
        parse_mode: "Markdown",
      },
    }]);
  }

  try {
    const data = createData(user);
    const cardId = await renderImage(data);
    const photoPath = path.resolve(__dirname, "../../../tmp", `userCard-${ cardId }.jpg`);

    if (!fs.existsSync(photoPath)) throw new Error("No card file");

    const sent = await bot.sendPhoto(CACHE_CHAT_ID, photoPath, { caption: "cache" });
    const fileId = sent.photo![sent.photo!.length - 1]!.file_id;

    const achievements = user.user_achievements;
    const playcount = user.statistics.play_count;
    const rankedPoints = (user.statistics.ranked_score / 1000000).toFixed(1);

    const caption = `
[osutrack](https://ameobea.me/osutrack/user/${ data.username })
[osuskills](https://osuskills.com/user/${ data.username })
*Достижения*: ${ achievements.length }
*Плейкаунт*: ${ playcount }
*Рейтинговых очков*: ${ rankedPoints }m
`;

    await bot.answerInlineQuery(query.id, [{
      type: "photo",
      id: cardId,
      photo_file_id: fileId,
      caption,
      parse_mode: "Markdown",
    } as TelegramBot.InlineQueryResultCachedPhoto]);

    fs.unlinkSync(photoPath);
  } catch (err) {
    console.error("Inline err:", err);
    await bot.answerInlineQuery(query.id, [{
      type: "article",
      id: "error",
      title: "Ошибка",
      input_message_content: { message_text: "Не сгенерировал карточку" },
    }]);
  }
});

console.log("📷 Inline handler registered");