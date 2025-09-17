const { Client } = require("osu-web.js");
const { OSU_TOKEN } = require("./config/env");

const api = new Client(OSU_TOKEN);

module.exports = api;