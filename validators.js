import { z } from "zod";
export const tokenSchema = z.object({
  name: z.string().min(2),
  symbol: z.string().min(2).max(12).regex(/^[A-Z0-9]+$/),
  supply: z.coerce.number().positive(),
  decimals: z.coerce.number().int().min(0).max(18).default(9),
  liquidity: z.coerce.number().min(0).default(0),
  network: z.enum(["mainnet", "testnet"]).default("testnet"),
  description: z.string().optional().default("")
});
export const parseToken = (input) => tokenSchema.parse(input);
