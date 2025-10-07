import dotenv from "dotenv";
import path from "path";

// Load .env from root directory
dotenv.config({ path: path.join(__dirname, "../../../.env") });

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  logLevel: process.env.LOG_LEVEL || "info",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3001",
  isProduction: process.env.NODE_ENV === "production",
};
