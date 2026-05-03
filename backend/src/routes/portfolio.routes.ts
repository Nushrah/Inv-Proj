import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { computePortfolioSummary } from "../services/portfolioSummary.service.js";

const router = Router();

router.get("/summary", authenticate, async (req, res, next) => {
  try {
    const userId = req.auth!.userId;
    const investments = await prisma.investment.findMany({ where: { userId } });
    const summary = computePortfolioSummary(investments);
    return res.json(summary);
  } catch (err) {
    return next(err);
  }
});

export const portfolioRouter = router;
