const { renderImage } = require("../services/renderImage");

const data = {
  username: "MessengerMAX",
  country: "Ukraine",
  worldTop: 1200000000000,
  countryTop: -1,

  a: -10,
  goldenS: 0.7,
  silverS: 0,
  goldenSS: 0,
  silverSS: 0,
  level: 0,
  levelProgress: 10,

  pp: 484,
  accuracy: 19,
  timePlayed: 17,
  points:207.1,

  pfp: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVc22FgIapuN5SmPjiN6uI3Vfj1uNO1ShdSg&s"
};
//country flag later
renderImage(data);
