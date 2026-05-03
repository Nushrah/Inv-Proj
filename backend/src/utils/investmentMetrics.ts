import type { Investment } from "@prisma/client";

export function serializeInvestment(inv: Investment) {
  const q = Number(inv.quantity);
  const purchasePrice = Number(inv.purchasePrice);
  const currentPrice = Number(inv.currentPrice);
  const purchaseCost = q * purchasePrice;
  const currentValue = q * currentPrice;
  const gainLoss = currentValue - purchaseCost;
  const gainLossPercent = purchaseCost === 0 ? 0 : (gainLoss / purchaseCost) * 100;

  return {
    id: inv.id,
    assetName: inv.assetName,
    symbol: inv.symbol,
    assetType: inv.assetType,
    quantity: q,
    purchasePrice,
    currentPrice,
    purchaseCost,
    currentValue,
    gainLoss,
    gainLossPercent,
    purchaseDate: inv.purchaseDate.toISOString().slice(0, 10),
    notes: inv.notes,
    updatedAt: inv.updatedAt.toISOString(),
  };
}
