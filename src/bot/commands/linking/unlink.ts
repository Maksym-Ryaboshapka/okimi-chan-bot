import type { Message } from "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";
import Link from "../../../db/models/Link.ts";
import { Queries } from "../../queries.ts";
import unlinkHandler from "../../handlers/unlinkHandler.ts";

export default async function onUnlink(bot: TelegramBot, msg: Message) {
  const tgName = msg.from?.username;

  if (!tgName) {
    return;
  }

  const candidate = await Link.findOne({ tgName });

  if (!candidate) {
    return await bot.sendMessage(msg.chat.id, `Ваш Telegram-аккаунт @${ tgName } не привязан к osu! профилю.`);
  }

  const question = await bot.sendMessage(msg.chat.id, `**⚠️ Вы действительно хотите отвязать Telegram-аккаунт от osu! профиля** ${ candidate.osuName }**?**`, {
    parse_mode: "Markdown",
    reply_to_message_id: msg.message_id,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Да ✅", callback_data: Queries.Unlink }, { text: "Нет ❌", callback_data: Queries.Null }]
      ]
    }
  });

  bot.on("callback_query", async (query) => {
    if (query.data === Queries.Unlink) {
      await unlinkHandler(bot, query);
    } else if (query.data === Queries.Null) {
      await bot.answerCallbackQuery(query.id);

      if (!query.message?.chat.id) {
        return;
      }

      await bot.sendMessage(query.message.chat.id, "Отвязка отменена.");
    }

    bot.deleteMessage(question.chat.id, question.message_id);
  });
}