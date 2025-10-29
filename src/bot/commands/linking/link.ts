import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import Link from "../../../db/models/Link.ts";
import getUser from "../../../services/osu/getUser.ts";

export default async function onLink(bot: TelegramBot, msg: Message, match: RegExpExecArray | null) {
  const tgName = msg.from?.username;
  const osuName = match && match[1] ? match[1].trim() : null;

  if (!osuName || !tgName) {
    await bot.sendMessage(msg.chat.id, "Пожалуйста, введите имя пользователя после /link");
    return;
  }

  const user = await getUser(osuName);

  if (!user) {
    return await bot.sendMessage(msg.chat.id, `Пользователь *${ osuName }* не найден.`, { parse_mode: "Markdown" });
  }

  await Link.deleteOne({ tgName });

  await Link.create({ tgName, osuName: user.username });

  await bot.sendMessage(
      msg.chat.id,
      `Аккаунт @${ tgName } успешно привязан к *${ user.username }*. Профиль доступен по команде /me.`, { parse_mode: "Markdown" }
  );
}