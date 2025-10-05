import axios from "axios";

export default async function createToken(clientId: string, clientSecret: string): Promise<string | null> {
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
    return null;
  }
}