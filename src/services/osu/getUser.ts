import createToken from "./createToken.ts";
import config from "../../config";
import { Client } from "osu-web.js";
import log from "../logs/logger.ts";

let token: string | null = null;

export default async function getUser(username: string) {
  try {
    if (!config.OSU_CLIENT_ID || !config.OSU_CLIENT_SECRET) {
      log("ERROR", "osu! token not received yet");
      throw new Error("osu! token not received yet");
    }

    const freshToken = await createToken(config.OSU_CLIENT_ID, config.OSU_CLIENT_SECRET);

    if (String(token) !== freshToken) {
      token = freshToken;
    }

    if (typeof token === "string") {
      const client = new Client(token);

      return await client.users.getUser(username, {
        urlParams: { mode: "osu" }
      });
    }
  } catch {
    return null;
  }
}