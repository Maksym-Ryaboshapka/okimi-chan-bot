import TelegramBot from "node-telegram-bot-api";
import bot from "../../bot";
import getUser from "../../services/osu/getUser";
import createData from "../../services/render/createData";
import renderImage from "../../services/render/renderImage";
import path from "path";
import fs from "fs";

const CACHE_CHAT_ID = process.env.CACHE_CHAT_ID || "-5069219296";

bot.on("inline_query", async (query) => {
  const username = query.query.trim();

  if (!username) {
    return bot.answerInlineQuery(query.id, [{
      type: "article",
      id: "help",
      title: "Поиск osu! игрока",
      description: "Введи ник после @okimichanbot",
      input_message_content: { message_text: "Введи ник osu! игрока после @okimichanbot" },
    }]);
  }

  const user = await getUser(username);

  if (!user) {
    return bot.answerInlineQuery(query.id, [{
      type: "article",
      id: "notfound",
      title: "Не найден",
      input_message_content: {
        message_text: `Игрок *${username}* не найден`,
        parse_mode: "Markdown",
      },
    }]);
  }

  try {
    const data = createData(user);
    const cardId = await renderImage(data);
    const photoPath = path.resolve(__dirname, "../../../tmp", `userCard-${cardId}.jpg`);

    if (!fs.existsSync(photoPath)) throw new Error("No card file");

    // Отправляем в кэш-группу для получения file_id
    const sent = await bot.sendPhoto(CACHE_CHAT_ID, photoPath, { caption: "cache" });
    const fileId = sent.photo![sent.photo!.length - 1]!.file_id;

    const caption = `*${user.username}* • osu! std
Глоб: ${user.statistics.global_rank ? `#${user.statistics.global_rank}` : "—"}
Страна: ${user.statistics.country_rank ? `#${user.statistics.country_rank}` : "—"} • ${user.country.name}
PP: ${Math.floor(user.statistics.pp)} • Acc: ${user.statistics.hit_accuracy.toFixed(2)}%`;

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