import TelegramBot, { type CallbackQuery } from "node-telegram-bot-api";
import Link from "../../db/models/Link.ts";

export default async function unlinkHandler(bot: TelegramBot, query: CallbackQuery) {
  await bot.answerCallbackQuery(query.id);

  const tgName = query.from.username;

  if (!tgName) {
    return;
  }

  const link = await Link.findOne({ tgName });

  if (!link) {
    return;
  }

  const { osuName } = link;

  await Link.deleteOne({ osuName });

  if (!query.message?.chat.id) {
    return;
  }

  await bot.sendMessage(query.message.chat.id, `Ваш аккаунт успешно отвязан от *${ osuName }*`);
}