import {configDotenv} from "dotenv";
import type { Config } from "./Config.types.ts";
configDotenv();

const config: Config = {
  OSU_CLIENT_ID: process.env.OSU_CLIENT_ID,
  OSU_CLIENT_SECRET: process.env.OSU_CLIENT_SECRET,
  BOT_TOKEN: process.env.BOT_TOKEN,
  DB_URI: process.env.DB_URI
};

export default config;