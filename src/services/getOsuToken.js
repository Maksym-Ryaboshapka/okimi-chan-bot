let token = null;

function setToken(newToken) {
  token = newToken;
}

function getToken() {
  if (!token) throw new Error("Osu token ещё не получен!");
  return token;
}

module.exports = {setToken, getToken};