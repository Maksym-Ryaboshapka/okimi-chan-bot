import TelegramBot, {Message} from "node-telegram-bot-api";

export default async function onStart(bot: TelegramBot, msg: Message): Promise<void> {
  const startMsg = `
🎮 *Добро пожаловать в osu! Stats Bot!*

Этот бот получает статистику игроков из *osu! API* и создаёт красивую визуализацию их профиля в виде картинки.

📊 *Как пользоваться:*
Просто отправь команду с никнеймом игрока:
\`/user <ник_игрока>\`

_Пример:_ \`/user HELLPER2010\`

✨ Бот создаст стильную карточку со всей важной информацией о профиле игрока!

👥 *Разработчики:*
@HELLPER7788 • @ByteMe6 • @ArchiPank

_Приятного использования!_ 🚀
`;

  await bot.sendMessage(msg.chat.id, startMsg, {parse_mode: "Markdown"});
}