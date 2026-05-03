import { Router } from "express";
import { TransactionType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { HttpError } from "../middleware/error.middleware.js";
import { serializeInvestment } from "../utils/investmentMetrics.js";
import { investmentBodySchema } from "../validators/investment.validators.js";

const router = Router();

router.use(authenticate);

const idParamSchema = z.object({
  id: z.string().uuid(),
});

function notesOrNull(notes: string | null | undefined) {
  if (notes === undefined || notes === null) return null;
  const t = notes.trim();
  return t.length ? t : null;
}

router.get("/", async (req, res, next) => {
  try {
    const userId = req.auth!.userId;
    const rows = await prisma.investment.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return res.json(rows.map(serializeInvestment));
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const userId = req.auth!.userId;
    const body = investmentBodySchema.parse(req.body);

    await prisma.$transaction(async (tx) => {
      const inv = await tx.investment.create({
        data: {
          userId,
          assetName: body.assetName,
          symbol: body.symbol,
          assetType: body.assetType,
          quantity: body.quantity,
          purchasePrice: body.purchasePrice,
          currentPrice: body.currentPrice,
          purchaseDate: body.purchaseDate,
          notes: notesOrNull(body.notes ?? undefined),
        },
      });

      const buyNotes =
        body.notes === undefined || body.notes === null
          ? "Initial purchase"
          : (notesOrNull(body.notes) ?? "Initial purchase");

      await tx.transaction.create({
        data: {
          userId,
          investmentId: inv.id,
          transactionType: TransactionType.BUY,
          quantity: body.quantity,
          price: body.purchasePrice,
          transactionDate: body.purchaseDate,
          notes: buyNotes,
        },
      });
    });

    return res.status(201).json({ message: "Investment created successfully" });
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.auth!.userId;
    const { id } = idParamSchema.parse(req.params);
    const body = investmentBodySchema.parse(req.body);

    const existing = await prisma.investment.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return next(new HttpError(404, "Investment not found"));
    }

    const oldQty = Number(existing.quantity);

    await prisma.$transaction(async (tx) => {
      const result = await tx.investment.updateMany({
        where: { id, userId },
        data: {
          assetName: body.assetName,
          symbol: body.symbol,
          assetType: body.assetType,
          quantity: body.quantity,
          purchasePrice: body.purchasePrice,
          currentPrice: body.currentPrice,
          purchaseDate: body.purchaseDate,
          notes: notesOrNull(body.notes ?? undefined),
        },
      });
      if (result.count !== 1) {
        throw new HttpError(404, "Investment not found");
      }

      const newQty = Number(body.quantity);
      if (newQty < oldQty) {
        const soldQty = oldQty - newQty;
        const sellDate = new Date();
        sellDate.setUTCHours(0, 0, 0, 0);

        await tx.transaction.create({
          data: {
            userId,
            investmentId: id,
            transactionType: TransactionType.SELL,
            quantity: soldQty,
            price: body.currentPrice,
            transactionDate: sellDate,
            notes: "Partial sale (quantity reduced)",
          },
        });
      }
    });

    return res.json({ message: "Investment updated successfully" });
  } catch (err) {
    return next(err);
  }
});

export const investmentRouter = router;
