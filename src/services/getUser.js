const getOsuClient = require("../osuClient");

const getUser = async (username) => {
  try {
    const client = await getOsuClient();
    const user = await client.users.getUser(username, {
      urlParams: {
        mode: "osu"
      }
    });

    return user;
  } catch (e) {
    return null;
  }
};

module.exports = getUser;