import {configDotenv} from "dotenv";
import Config from "./config.types";
configDotenv();

const config: Config = {
  OSU_CLIENT_ID: process.env.OSU_CLIENT_ID,
  OSU_CLIENT_SECRET: process.env.OSU_CLIENT_SECRET,
  BOT_TOKEN: process.env.BOT_TOKEN
};

export default config;