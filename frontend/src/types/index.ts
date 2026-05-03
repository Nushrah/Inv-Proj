export type AssetType = "STOCK" | "BOND" | "MUTUAL_FUND" | "ETF" | "CASH" | "OTHER";

export type User = { id: string; name: string; email: string };

export type InvestmentRow = {
  id: string;
  assetName: string;
  symbol: string;
  assetType: AssetType;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseCost: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  purchaseDate: string;
  notes: string | null;
  updatedAt: string;
};

export type PortfolioSummary = {
  totalPortfolioValue: number;
  totalPurchaseCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  investmentCount: number;
  calculatedAt: string;
  allocationByType: { assetType: AssetType; value: number; percentage: number }[];
  riskExposure: {
    riskLevel: "NONE" | "LOW" | "MODERATE" | "HIGH";
    highestExposureAssetType: AssetType | null;
    highestExposurePercent: number;
    message: string;
  };
};

export type TransactionRow = {
  id: string;
  assetName: string;
  symbol: string;
  transactionType: "BUY" | "SELL";
  quantity: number;
  price: number;
  totalAmount: number;
  transactionDate: string;
  notes: string | null;
};

export const ASSET_TYPES: AssetType[] = [
  "STOCK",
  "BOND",
  "MUTUAL_FUND",
  "ETF",
  "CASH",
  "OTHER",
];
