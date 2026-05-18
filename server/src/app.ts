import "reflect-metadata"; // Required for tsyringe dependency injection
import "./config/container"; // Register containers
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Standard middlewares
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Base Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Modular Routes
app.use("/api/v1/auth", authRouter);

// Centralized error handler (must be registered last)
app.use(errorHandler);

export default app;
