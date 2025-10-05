import TelegramBot, {Message} from "node-telegram-bot-api";

export default async function onStart(bot: TelegramBot, msg: Message): Promise<void> {
  await bot.sendMessage(msg.chat.id, "Тут будет стартовое соо");
}