const chromium = require("chromium");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer-core");
const { renderImage } = require("../services/renderImage");


const data = { username: "MessengerMAX", age: 2 };
renderImage(data);