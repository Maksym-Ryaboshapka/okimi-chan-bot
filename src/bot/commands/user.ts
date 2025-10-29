import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import getUser from "../../services/osu/getUser";
import renderImage from "../../services/render/renderImage.ts";
import createData from "../../services/render/createData.ts";
import sendPhoto from "../sendPhoto.ts";

export default async function onUser(bot: TelegramBot, msg: Message, match: RegExpExecArray | null): Promise<void | undefined> {
  const username = match && match[1] ? match[1].trim() : null;

  if (!username) {
    await bot.sendMessage(msg.chat.id, "Пожалуйста, введите имя пользователя после /user");
    return;
  }

  const sent = await bot.sendMessage(msg.chat.id, "⌛️");

  const user = await getUser(username);

  if (!user) {
    await bot.sendMessage(msg.chat.id, `Пользователь *${ username }* не найден`, { parse_mode: "Markdown" });
    await bot.deleteMessage(msg.chat.id, sent.message_id);

    return;
  }

  const data = createData(user);

  const cardId = await renderImage(data);

  await sendPhoto({ bot, msg, sent, data, user, cardId });
}