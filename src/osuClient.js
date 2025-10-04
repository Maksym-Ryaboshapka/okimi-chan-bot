const { Client } = require("osu-web.js");
const createOsuToken = require("./services/createOsuToken");
const { OSU_CLIENT_ID, OSU_CLIENT_SECRET } = require("./config");
const { getToken, setToken } = require("./services/getOsuToken");

async function getOsuClient() {
  let token;
  try {
    token = getToken();
  } catch {
    token = await createOsuToken(OSU_CLIENT_ID, OSU_CLIENT_SECRET);
    setToken(token);
  }

  const api = new Client(token);
  return api;
}

module.exports = getOsuClient;