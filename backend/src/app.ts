import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pricePointRoutes from "./routes/pricePointRoutes";
import logger from "./utils/logger";
import { config } from "./config";

const app = express();

// Configure CORS
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

app.use("/api", pricePointRoutes);

// Global error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Log the error with context
    logger.error({
      message: err.message,
      method: req.method,
      url: req.url,
      body: req.body,
      stack: err.stack,
      errorCode: err.code,
    });

    // Handle known errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: err.message,
        code: "VALIDATION_ERROR",
        details: err.details,
      });
    }

    if (err.name === "NotFoundError") {
      return res.status(404).json({
        error: err.message,
        code: "NOT_FOUND",
      });
    }

    // Handle unexpected errors
    res.status(err.statusCode || 500).json({
      error: err.message || "Internal Server Error",
      code: err.code || "SERVER_ERROR",
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
  }
);

export default app;
