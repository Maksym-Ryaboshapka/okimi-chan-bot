const { renderImage } = require("../services/renderImage");

const data = {
  username: "MessengerMAX",
  country: "Ukraine",
  worldTop: 12000000,
  countryTop: 1,

  a: 10,
  goldenS: 7,
  silverS: 0,
  goldenSS: 3,
  silverSS: 1,
  level: 31,
  levelProgress: 68,

  pp: 484,
  accuracy: 19,
  timePlayed: 17,
  points:207.1,

  pfp: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVc22FgIapuN5SmPjiN6uI3Vfj1uNO1ShdSg&s"
};
//country flag later
renderImage(data);
