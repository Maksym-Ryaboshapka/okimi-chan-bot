const getOsuClient = require("../osuClient");

const getUser = async (username) => {
  try {
    const client = await getOsuClient();

    return await client.users.getUser(username, {
      urlParams: {
        mode: "osu"
      }
    });
  } catch {
    return null;
  }
};

module.exports = getUser;