import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { investmentRouter } from "./routes/investment.routes.js";
import { portfolioRouter } from "./routes/portfolio.routes.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/investments", investmentRouter);
  app.use("/api/portfolio", portfolioRouter);

  app.use(errorHandler);

  return app;
}
