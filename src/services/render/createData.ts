import type { UserExtended } from "osu-web.js";
import type { ClearUser } from "../../types/ClearUser.types.ts";

export default function createData(user: UserExtended): ClearUser {
  const username = user.username;
  const country = user.country.name;
  const worldTop = user.statistics.global_rank ? `#${ user.statistics.global_rank }` : "-";
  const countryTop = user.statistics.country_rank ? `#${ user.statistics.country_rank }` : "-";

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

  return {
    username,
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
}