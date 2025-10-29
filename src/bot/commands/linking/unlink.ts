import type { Message } from "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";
import Link from "../../../db/models/Link.ts";
import { Queries } from "../../queries.ts";

export default async function onUnlink(bot: TelegramBot, msg: Message) {
  const tgName = msg.from?.username;

  if (!tgName) {
    return;
  }

  const candidate = await Link.findOne({ tgName });

  if (!candidate) {
    return await bot.sendMessage(msg.chat.id, `${ tgName } не имеет привязанного osu! аккаунта`);
  }

  await bot.sendMessage(msg.chat.id, `*⚠️ Вы уверены что хотите отвязать свой телеграм аккаунт от ${ candidate.osuName }?*`, {
    parse_mode: "Markdown",
    reply_to_message_id: msg.message_id,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Да✅", callback_data: Queries.Unlink }, { text: "Нет❌", callback_data: Queries.Cancel }]
      ]
    }
  });
}