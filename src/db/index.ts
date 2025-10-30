import * as mongoose from "mongoose";
import config from "../config";
import log from "../services/logs/logger.ts";

export default async function connectDB() {
  if (!config.DB_URI) {
    log("ERROR", "Failed to connect to the database");
    throw new Error("DB token not received yet");
  }

  return await mongoose.connect(config.DB_URI);
}