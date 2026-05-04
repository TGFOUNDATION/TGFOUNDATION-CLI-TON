import { TonClient } from "@ton/ton";

export function createTonClient({ network = "testnet", rpcUrl = "" } = {}) {
  const endpoint = rpcUrl || (network === "mainnet"
    ? "https://toncenter.com/api/v2/jsonRPC"
    : "https://testnet.toncenter.com/api/v2/jsonRPC");

  return new TonClient({
    endpoint,
    apiKey: process.env.TONCENTER_API_KEY || undefined
  });
}
