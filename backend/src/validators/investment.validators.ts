import { AssetType } from "@prisma/client";
import { z } from "zod";

export const investmentBodySchema = z.object({
  assetName: z.string().trim().min(1).max(100),
  symbol: z.string().trim().min(1).max(20),
  assetType: z.nativeEnum(AssetType),
  quantity: z.coerce.number().positive(),
  purchasePrice: z.coerce.number().nonnegative(),
  currentPrice: z.coerce.number().nonnegative(),
  purchaseDate: z.coerce.date(),
  notes: z.union([z.string().max(5000), z.null()]).optional(),
});

export type InvestmentBody = z.infer<typeof investmentBodySchema>;
