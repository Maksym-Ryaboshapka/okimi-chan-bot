// import ClearUser from "../src/types/ClearUser.types";
// import renderImage from "../src/utils/renderImage";
//
// const data: ClearUser = {
//   username: "MessengerMAX",
//   country: "Ukraine",
//   worldTop: 1200000000000,
//   countryTop: 1,
//
//   a: 10,
//   goldenS: 0.7,
//   silverS: 0,
//   goldenSS: 20,
//   silverSS: 0,
//   level: 122,
//   levelProgress: 40,
//
//   pp: 484,
//   accuracy: "19",
//   timePlayed: 17,
//   points: "207.1",
//
//   pfp: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVc22FgIapuN5SmPjiN6uI3Vfj1uNO1ShdSg&s"
// };
//
// renderImage(data).then(id => console.log(id));

import ClearUser from "../src/types/ClearUser.types";
import renderImage from "../src/utils/renderImage";

describe("renderImage", () => {
  it("should render image for given ClearUser data", async () => {
    const data: ClearUser = {
      username: "MessengerMAX",
      country: "Ukraine",
      worldTop: 1200000000000,
      countryTop: 1,
      a: 10,
      goldenS: 0.7,
      silverS: 0,
      goldenSS: 20,
      silverSS: 0,
      level: 122,
      levelProgress: 40,
      pp: 484,
      accuracy: "19",
      timePlayed: 17,
      points: "207.1",
      pfp: "https://example.com/avatar.png"
    };

    const result = await renderImage(data);

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });
});