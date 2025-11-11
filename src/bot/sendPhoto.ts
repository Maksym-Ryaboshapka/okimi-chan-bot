import path from "path";
import fs from "fs";
import TelegramBot, { type Message } from "node-telegram-bot-api";
import type { ClearUser } from "../services/render/ClearUser.types.ts";
import type { UserExtended } from "osu-web.js";
import log from "../services/logs/logger.ts";

export default async function sendPhoto({ bot, msg, sent, data, user, cardId }: {
  bot: TelegramBot;
  msg: Message;
  sent?: Message;
  data: ClearUser;
  user: UserExtended;
  cardId: string;
}) {
  const rootPath = path.resolve(__dirname, "..", "..");
  const cardPath = path.resolve(rootPath, "tmp", `userCard-${ cardId }.jpg`);

  const achievements = user.user_achievements;
  const playcount = user.statistics.play_count;
  const rankedPoints = (user.statistics.ranked_score / 1000000).toFixed(1);

  const caption = `
[osutrack](https://ameobea.me/osutrack/user/${ data.username })
[osuskills](https://osuskills.com/user/${ data.username })
*Достижения*: ${ achievements.length }
*Плейкаунт*: ${ playcount }
*Рейтинговых очков*: ${ rankedPoints }m
`;

  await bot.sendPhoto(msg.chat.id, fs.createReadStream(cardPath), {
    reply_to_message_id: msg.message_id,
    caption,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Профиль пользователя", url: `https://osu.ppy.sh/users/${ data.username }` }
        ]
      ]
    }
  }, {
    filename: `userCard-${cardId}.jpg`,
    contentType: "image/jpeg"
  });

  if (sent) {
    bot.deleteMessage(msg.chat.id, sent.message_id);
  }

  fs.rm(cardPath, (err) => {
    if (err) {
      log("ERROR", `Failed to delete userCard-${ cardId }`);
      throw new Error(`Failed to delete userCard-${ cardId }: `, err);
    }
  });
}