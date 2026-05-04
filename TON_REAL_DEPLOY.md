# TON Real Deploy Notes

This project includes a safe scaffold only.

Before real deployment:

1. Use audited Jetton minter and wallet contracts.
2. Verify metadata storage.
3. Test on testnet.
4. Confirm wallet balance and sequence number.
5. Never store mnemonic in source code.
6. Use hardware wallet or secure signer for mainnet.

The `tgf ton-check` command only verifies client/wallet access.
