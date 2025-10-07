declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    LOG_LEVEL: string;
    CORS_ORIGIN: string;
    VITE_API_URL: string;
    VITE_API_TIMEOUT: string;
  }
}

export {};
