import TelegramBot from "node-telegram-bot-api";
import type {Message} from "node-telegram-bot-api";
import fs from "fs";
import path from "path";
import getUser from "../../services/osu/getUser";
import renderImage from "../../utils/renderImage";
import type ClearUser from "../../types/ClearUser.types";

export default async function onUser(bot: TelegramBot, msg: Message, match: RegExpExecArray | null): Promise<void | undefined> {
  const username = match && match[1] ? match[1].trim() : null;

  if (!username) {
    await bot.sendMessage(msg.chat.id, "Пожалуйста, введите имя пользователя после /user");
    return;
  }

  const user = await getUser(username);

  if (!user) {
    await bot.sendMessage(msg.chat.id, `Пользователь ${username} не найден`);
    return;
  }

  const usernameApi = user.username;
  const country = user.country.name;
  const worldTop = user.statistics.global_rank;
  const countryTop = user.statistics.country_rank;

  const a = user.statistics.grade_counts.a;
  const silverS = user.statistics.grade_counts.s;
  const goldenS = user.statistics.grade_counts.sh;
  const silverSS = user.statistics.grade_counts.ss;
  const goldenSS = user.statistics.grade_counts.ssh;
  const level = user.statistics.level.current;
  const levelProgress = user.statistics.level.progress;

  const pp = Math.floor(user.statistics.pp);
  const accuracy = user.statistics.hit_accuracy.toFixed(2);
  const timePlayed = Math.floor(user.statistics.play_time / (60 * 60));
  const points = (user.statistics.total_score / 1000000).toFixed(1);

  const pfp = user.avatar_url;

  const data: ClearUser = {
    username: usernameApi,
    country,
    worldTop,
    countryTop,
    a,
    silverS,
    goldenS,
    silverSS,
    goldenSS,
    level,
    levelProgress,
    pp,
    accuracy,
    timePlayed,
    points,
    pfp
  };
  
  const cardId = await renderImage(data);

  const rootPath = path.resolve(__dirname, "..", "..");
  const cardPath = path.resolve(rootPath, "templates", `userCard-${cardId}.jpg`);

  await bot.sendPhoto(msg.chat.id, cardPath);
  fs.rmSync(cardPath);
}