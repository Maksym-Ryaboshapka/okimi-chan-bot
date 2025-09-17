const osuApi = require("../../osuClient");

const getUser = async (username) => {
  try {
    const user = await osuApi.users.getUser(username, {
      urlParams: {
        mode: "osu",
      },
    });

    return user;
  } catch (e) {
    console.log(e);
  }
};

module.exports = getUser;
