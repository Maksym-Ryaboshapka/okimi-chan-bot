import { Client } from "osu-web.js";
import createToken from "./createToken";
import config from "../../config";
import { getToken, setToken } from "./getToken";
import log from "../logs/logger.ts";

export default async function getClient(): Promise<Client> {
  let token: string | null | undefined;
  try {
    token = getToken();
  } catch {
    token = null;
  }

  if (!token) {
    if (!config.OSU_CLIENT_ID || !config.OSU_CLIENT_SECRET) {
      log("ERROR", "Failed to create osu client");
      throw new Error("Missing osu! client credentials in config");
    }

    token = await createToken(config.OSU_CLIENT_ID, config.OSU_CLIENT_SECRET);

    if (!token) throw new Error("Failed to create osu! token");
    setToken(token);
  }

  return new Client(token);
}
