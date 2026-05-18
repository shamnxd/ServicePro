import fs from "fs";
import path from "path";
import { env } from "../config/env";

export class Logger {
  private static logDirectory = path.join(process.cwd(), "logs");

  public static initialize(): void {
    // 1. Ensure log directory exists
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }

    // 2. Perform log rotation / retention cleanup
    this.cleanupOldLogs();
  }

  private static cleanupOldLogs(): void {
    try {
      if (!fs.existsSync(this.logDirectory)) return;

      const files = fs.readdirSync(this.logDirectory);
      const now = Date.now();
      const retentionDays = parseInt(env.LOG_RETENTION_DAYS, 10) || 3;
      const retentionMs = retentionDays * 24 * 60 * 60 * 1000;

      for (const file of files) {
        const filePath = path.join(this.logDirectory, file);
        const stats = fs.statSync(filePath);

        // Calculate age of the file based on its last modification timestamp
        const age = now - stats.mtime.getTime();

        if (age > retentionMs) {
          fs.unlinkSync(filePath);
          console.log(`[Logger] Purged historical log file: ${file} (older than ${retentionDays} days)`);
        }
      }
    } catch (error) {
      console.error("[Logger] Warning: Log rotation cleanup failed:", error);
    }
  }

  private static writeLog(level: "INFO" | "WARN" | "ERROR" | "DEBUG", message: string, meta?: unknown): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message} ${meta ? JSON.stringify(meta) : ""}\n`;

    // 1. Mirror output to standard terminal streams
    if (level === "ERROR") {
      console.error(formattedMessage.trim());
    } else if (level === "WARN") {
      console.warn(formattedMessage.trim());
    } else {
      console.log(formattedMessage.trim());
    }

    // 2. Append output to corresponding daily log file
    try {
      const dateStr = new Date().toISOString().split("T")[0]; // Yields YYYY-MM-DD
      const logFile = path.join(this.logDirectory, `app-${dateStr}.log`);
      
      if (!fs.existsSync(this.logDirectory)) {
        fs.mkdirSync(this.logDirectory, { recursive: true });
      }

      fs.appendFileSync(logFile, formattedMessage);
    } catch (err) {
      console.error("[Logger] Critical: Failed to write to log file", err);
    }
  }

  public static info(message: string, meta?: unknown): void {
    this.writeLog("INFO", message, meta);
  }

  public static warn(message: string, meta?: unknown): void {
    this.writeLog("WARN", message, meta);
  }

  public static error(message: string, error?: Error | unknown, meta?: unknown): void {
    const errorDetails = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack, ...meta as object } 
      : { rawError: error, ...meta as object };
    this.writeLog("ERROR", message, errorDetails);
  }

  public static debug(message: string, meta?: unknown): void {
    this.writeLog("DEBUG", message, meta);
  }
}
