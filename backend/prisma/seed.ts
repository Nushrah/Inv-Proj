import { PrismaClient, AssetType, TransactionType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: { name: "Demo User", passwordHash },
    create: {
      name: "Demo User",
      email: "demo@example.com",
      passwordHash,
    },
  });

  const holdings = [
    {
      assetName: "Apple Inc.",
      symbol: "AAPL",
      assetType: AssetType.STOCK,
      quantity: 10,
      purchasePrice: 150,
      currentPrice: 180,
      purchaseDate: new Date("2026-01-10"),
      notes: "Long-term holding",
      buyNotes: "Initial purchase",
    },
    {
      assetName: "US Treasury Bond",
      symbol: "USBOND",
      assetType: AssetType.BOND,
      quantity: 5,
      purchasePrice: 98,
      currentPrice: 99,
      purchaseDate: new Date("2026-02-01"),
      notes: "Government bond",
      buyNotes: "Initial purchase",
    },
    {
      assetName: "Vanguard Mutual Fund",
      symbol: "VFIAX",
      assetType: AssetType.MUTUAL_FUND,
      quantity: 25,
      purchasePrice: 400,
      currentPrice: 415,
      purchaseDate: new Date("2026-02-15"),
      notes: "Index fund",
      buyNotes: "Initial purchase",
    },
    {
      assetName: "Cash Reserve",
      symbol: "CASH",
      assetType: AssetType.CASH,
      quantity: 1,
      purchasePrice: 5000,
      currentPrice: 5000,
      purchaseDate: new Date("2026-03-01"),
      notes: "Cash position",
      buyNotes: "Initial purchase",
    },
  ] as const;

  for (const h of holdings) {
    const existing = await prisma.investment.findFirst({
      where: { userId: user.id, symbol: h.symbol },
    });

    if (existing) {
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const inv = await tx.investment.create({
        data: {
          userId: user.id,
          assetName: h.assetName,
          symbol: h.symbol,
          assetType: h.assetType,
          quantity: h.quantity,
          purchasePrice: h.purchasePrice,
          currentPrice: h.currentPrice,
          purchaseDate: h.purchaseDate,
          notes: h.notes,
        },
      });

      await tx.transaction.create({
        data: {
          userId: user.id,
          investmentId: inv.id,
          transactionType: TransactionType.BUY,
          quantity: h.quantity,
          price: h.purchasePrice,
          transactionDate: h.purchaseDate,
          notes: h.buyNotes,
        },
      });
    });
  }

  console.log("Seed completed for demo@example.com");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
