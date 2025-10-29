import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import Link from "../../../db/models/Link.ts";
import getUser from "../../../services/osu/getUser.ts";
import createData from "../../../services/render/createData.ts";
import renderImage from "../../../services/render/renderImage.ts";
import sendPhoto from "../../sendPhoto.ts";

export default async function onMe(bot: TelegramBot, msg: Message) {
  const tgName = msg.from?.username;

  if (!tgName) {
    return;
  }

  const candidate = await Link.findOne({ tgName });

  if (!candidate) {
    return await bot.sendMessage(msg.chat.id, `Аккаунт @${ tgName } не привязан к osu! профилю. Воспользуйтесь командой /link.`);
  }

  const osuName = candidate.osuName;

  const sent = await bot.sendMessage(msg.chat.id, "⏳");

  const user = await getUser(osuName);

  if (!user) {
    return await bot.deleteMessage(msg.chat.id, sent.message_id);
  }

  const data = createData(user);

  const cardId = await renderImage(data);

  await sendPhoto({ bot, msg, sent, data, user, cardId });
}