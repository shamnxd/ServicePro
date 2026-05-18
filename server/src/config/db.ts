import mongoose from "mongoose";
import { Logger } from "../utils/logger";
import { env } from "./env";

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.connection.on("connected", () => {
      Logger.info("MongoDB connected successfully. Database connection pooled.");
    });

    mongoose.connection.on("error", (err) => {
      Logger.error("MongoDB connection error occurred", err);
    });

    mongoose.connection.on("disconnected", () => {
      Logger.warn("MongoDB connection disconnected.");
    });

    await mongoose.connect(env.MONGO_URI);
  } catch (error) {
    Logger.error("Critical: Failed to connect to MongoDB", error);
    process.exit(1);
  }
};
