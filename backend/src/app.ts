import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);

  app.use(errorHandler);

  return app;
}
