import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import Link from "../../../db/models/Link.ts";
import getUser from "../../../services/osu/getUser.ts";

export default async function onLink(bot: TelegramBot, msg: Message) {
  await bot.sendMessage(msg.chat.id, "Вы можете привязать свой телеграм аккаунт к osu! нику. Введите ваш никнейм в osu!");

  const osuNickHandler = async (msg: Message) => {
    const tgName = msg.from?.username;
    const osuName = msg.text?.trim();

    if (!osuName || !tgName) return;

    const user = await getUser(osuName);

    if (!user) {
      return await bot.sendMessage(msg.chat.id, `Пользователь *${ osuName }* не найден`, { parse_mode: "Markdown" });
    }

    await Link.deleteOne({ tgName });

    await Link.create({ tgName, osuName: user.username });

    await bot.sendMessage(
        msg.chat.id,
        `@${ tgName } успешно привязан к *${ user.username }*. Теперь Вы можете посмотреть свой профиль, написав /me`,
        {
          parse_mode: "Markdown"
        }
    );

    bot.off("message", osuNickHandler);
  };

  bot.on("message", osuNickHandler);
}
