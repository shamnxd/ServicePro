import dotenv from "dotenv";

// Pre-load environment variables from .env
dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not configured`);
  }
  return value;
}

export const env = {
  NODE_ENV: getEnv('NODE_ENV'),
  PORT: getEnv('PORT'),
  MONGO_URI: getEnv('MONGO_URI'),
  JWT_ACCESS_SECRET: getEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES_IN: getEnv('JWT_ACCESS_EXPIRES_IN'),
  JWT_REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN'),
  COOKIE_NAME_REFRESH: getEnv('COOKIE_NAME_REFRESH'),
  FRONTEND_URL: getEnv('FRONTEND_URL'),
  LOG_RETENTION_DAYS: getEnv('LOG_RETENTION_DAYS'),
};
