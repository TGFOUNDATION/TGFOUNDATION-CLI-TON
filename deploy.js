import { mnemonicToPrivateKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import { createTonClient } from "./client.js";

/**
 * Scaffold for real TON deployment.
 * This does NOT deploy a Jetton contract by itself.
 * Add audited Jetton minter contract code/cell here before using funds.
 */
export async function realDeployScaffold({ network, rpcUrl, mnemonic }) {
  if (!mnemonic) throw new Error("TON_MNEMONIC is required for real deploy scaffold");
  const words = mnemonic.trim().split(/\s+/);
  const keyPair = await mnemonicToPrivateKey(words);
  const client = createTonClient({ network, rpcUrl });
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
  const walletAddress = wallet.address.toString({ bounceable: false });

  const balance = await client.getBalance(wallet.address);
  return {
    walletAddress,
    balanceNano: balance.toString(),
    nextStep: "Add audited Jetton minter contract code and send deployment transaction."
  };
}
