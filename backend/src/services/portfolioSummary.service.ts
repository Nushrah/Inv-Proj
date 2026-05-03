import type { AssetType, Investment } from "@prisma/client";

export type RiskLevel = "NONE" | "LOW" | "MODERATE" | "HIGH";

export type PortfolioSummaryResponse = {
  totalPortfolioValue: number;
  totalPurchaseCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  investmentCount: number;
  calculatedAt: string;
  allocationByType: { assetType: AssetType; value: number; percentage: number }[];
  riskExposure: {
    riskLevel: RiskLevel;
    highestExposureAssetType: AssetType | null;
    highestExposurePercent: number;
    message: string;
  };
};

function riskMessage(riskLevel: RiskLevel, dominant: AssetType | null): string {
  if (riskLevel === "NONE") {
    return "Add investments to view portfolio risk exposure.";
  }
  if (riskLevel === "LOW") {
    return "Your portfolio is reasonably diversified across asset types.";
  }
  if (!dominant) {
    return "Your portfolio is reasonably diversified across asset types.";
  }
  if (riskLevel === "MODERATE") {
    return `Your portfolio has a noticeable concentration in ${dominant} assets. Consider reviewing your allocation.`;
  }
  return `Your portfolio is highly concentrated in ${dominant} assets. This may increase exposure to market volatility affecting that asset class.`;
}

export function computePortfolioSummary(investments: Investment[]): PortfolioSummaryResponse {
  const calculatedAt = new Date().toISOString();

  if (investments.length === 0) {
    return {
      totalPortfolioValue: 0,
      totalPurchaseCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      investmentCount: 0,
      calculatedAt,
      allocationByType: [],
      riskExposure: {
        riskLevel: "NONE",
        highestExposureAssetType: null,
        highestExposurePercent: 0,
        message: riskMessage("NONE", null),
      },
    };
  }

  let totalPurchaseCost = 0;
  let totalPortfolioValue = 0;
  const valueByType = new Map<AssetType, number>();

  for (const inv of investments) {
    const q = Number(inv.quantity);
    const purchasePrice = Number(inv.purchasePrice);
    const currentPrice = Number(inv.currentPrice);
    totalPurchaseCost += q * purchasePrice;
    totalPortfolioValue += q * currentPrice;
    const cv = q * currentPrice;
    valueByType.set(inv.assetType, (valueByType.get(inv.assetType) ?? 0) + cv);
  }

  const totalGainLoss = totalPortfolioValue - totalPurchaseCost;
  const totalGainLossPercent =
    totalPurchaseCost === 0 ? 0 : (totalGainLoss / totalPurchaseCost) * 100;

  const allocationByType = [...valueByType.entries()]
    .map(([assetType, value]) => ({
      assetType,
      value,
      percentage:
        totalPortfolioValue === 0 ? 0 : (value / totalPortfolioValue) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  let dominant: AssetType | null = null;
  let highestPct = 0;
  for (const row of allocationByType) {
    if (row.percentage > highestPct) {
      highestPct = row.percentage;
      dominant = row.assetType;
    }
  }

  let riskLevel: RiskLevel;
  if (totalPortfolioValue === 0) {
    riskLevel = "LOW";
    dominant = null;
    highestPct = 0;
  } else if (highestPct > 75) {
    riskLevel = "HIGH";
  } else if (highestPct > 50) {
    riskLevel = "MODERATE";
  } else {
    riskLevel = "LOW";
  }

  return {
    totalPortfolioValue,
    totalPurchaseCost,
    totalGainLoss,
    totalGainLossPercent,
    investmentCount: investments.length,
    calculatedAt,
    allocationByType,
    riskExposure: {
      riskLevel,
      highestExposureAssetType: dominant,
      highestExposurePercent: highestPct,
      message: riskMessage(riskLevel, dominant),
    },
  };
}
