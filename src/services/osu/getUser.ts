import getClient from "./getClient";

export default async function getUser(username: string) {
  try {
    const client = await getClient();

    return await client.users.getUser(username, {
      urlParams: {
        mode: "osu"
      }
    });
  } catch {
    return null;
  }
}