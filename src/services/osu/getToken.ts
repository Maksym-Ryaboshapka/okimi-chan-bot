let token: string | null = null;

export function setToken(newToken: string) {
  token = newToken;
}

export function getToken() {
  if (!token) throw new Error("osu! token not received yet");
  return token;
}