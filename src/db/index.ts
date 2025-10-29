import * as mongoose from "mongoose";
import config from "../config";

export default async function connectDB() {
  if (!config.DB_URI) {
    throw new Error("DB token not received yet");
  }

  return await mongoose.connect(config.DB_URI);
}