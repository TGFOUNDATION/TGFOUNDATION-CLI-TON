# TG FOUNDATION Production Utility CLI

Production-ready package:
- Multi-language CLI: `en`, `ru`, `uk`, `af`, `vi`, `ar`
- Utility audit
- Jetton metadata generator
- Simulated deploy command + receipt
- Telegram bot mode
- TON real-deploy scaffold/check
- MIT License
- GitHub Actions template
- npm publish guide

## Install

```bash
npm install
npm link
tgf --help
```

## Commands

```bash
tgf init
tgf status --lang vi
tgf audit --name MTONGA --symbol MTONGA --supply 1000000000 --liquidity 50 --network mainnet
tgf metadata --name MTONGA --symbol MTONGA --supply 1000000000 --out metadata.json
tgf deploy --name MTONGA --symbol MTONGA --supply 1000000000 --out receipt.json --qr
```

## Telegram bot

```bash
cp .env.example .env
# fill TELEGRAM_BOT_TOKEN
npm run bot
```

Bot commands:

```text
/audit --name TEST --symbol TEST --supply 1000
/metadata --name TEST --symbol TEST --supply 1000
```

## TON scaffold

```bash
cp .env.example .env
# fill TON_MNEMONIC and TONCENTER_API_KEY
tgf ton-check --network testnet
```

Real deploy is scaffold-only. Add audited Jetton minter contract code before sending real funds.

## Publish to npm

```bash
npm login
npm version patch
npm publish --access public
```
