import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const userId = req.auth!.userId;
    const rows = await prisma.transaction.findMany({
      where: { userId },
      include: { investment: true },
      orderBy: [{ transactionDate: "desc" }, { createdAt: "desc" }],
    });

    const payload = rows.map((t) => {
      const qty = Number(t.quantity);
      const price = Number(t.price);
      return {
        id: t.id,
        assetName: t.investment?.assetName ?? "Removed holding",
        symbol: t.investment?.symbol ?? "—",
        transactionType: t.transactionType,
        quantity: qty,
        price,
        totalAmount: qty * price,
        transactionDate: t.transactionDate.toISOString().slice(0, 10),
        notes: t.notes,
      };
    });

    return res.json(payload);
  } catch (err) {
    return next(err);
  }
});

export const transactionRouter = router;
