const axios = require("axios");

const createOsuToken = async (clientId, clientSecret) => {
  try {
    const res = await axios.post("https://osu.ppy.sh/oauth/token", {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
      scope: "public"
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    return res.data.access_token;
  } catch (e) {
    console.log(e);
  }
};

module.exports = createOsuToken;