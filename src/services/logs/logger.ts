import fs from "fs";
import path from "path";

const logDir = path.resolve(__dirname, "..", "..", "..", "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.resolve(logDir, "bot.log");

type LogLevel = "INFO" | "WARN" | "ERROR";

export default function log(level: LogLevel, msg: string) {
  const timestamp = new Date().toISOString();
  const formatted = `[${ timestamp }] [${ level }] ${ msg }`;

  fs.appendFileSync(logFile, formatted + "\n");

  switch (level) {
    case "INFO":
      console.log(formatted);
      break;
    case "WARN":
      console.warn(formatted);
      break;
    case "ERROR":
      console.error(formatted);
      break;
  }
}