import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import Link from "../../../db/models/Link.ts";
import getUser from "../../../services/osu/getUser.ts";
import { Queries } from "../../queries.ts";

export default async function onLink(bot: TelegramBot, msg: Message) {
  const question = await bot.sendMessage(msg.chat.id, "Введите ваш никнейм в osu! для привязки.", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Отмена ❌", callback_data: Queries.LinkCancel }]
      ]
    }
  });

  bot.on("callback_query", async (query) => {
    if (query.data === Queries.LinkCancel) {
      await bot.answerCallbackQuery(query.id);

      if (!query.message?.chat.id) {
        return;
      }

      await bot.sendMessage(query.message.chat.id, "Привязка отменена.");

      bot.off("message", osuNickHandler);

      await bot.deleteMessage(question.chat.id, question.message_id);
      return;
    }
  });

  async function osuNickHandler(msg: Message) {
    const tgName = msg.from?.username;
    const osuName = msg.text?.trim();

    if (!osuName || !tgName) return;

    const user = await getUser(osuName);

    if (!user) {
      return await bot.sendMessage(msg.chat.id, `Пользователь *${ osuName }* не найден.`, { parse_mode: "Markdown" });
    }

    await Link.deleteOne({ tgName });

    await Link.create({ tgName, osuName: user.username });

    await bot.sendMessage(
        msg.chat.id,
        `Аккаунт @${ tgName } успешно привязан к *${ user.username }*. Профиль доступен по команде /me.`,
        {
          parse_mode: "Markdown"
        }
    );

    bot.off("message", osuNickHandler);
    await bot.deleteMessage(question.chat.id, question.message_id);
  }

  bot.on("message", osuNickHandler);
}