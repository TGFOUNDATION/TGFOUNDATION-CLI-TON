import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import qrcode from "qrcode-terminal";
import { getConfig, setConfig } from "./core/config.js";
import { parseToken } from "./core/validators.js";
import { auditToken } from "./core/audit.js";
import { buildMetadata } from "./core/metadata.js";
import { fakeAddress, writeJson } from "./core/utils.js";
import { t, setLanguage } from "./i18n.js";
import { startTelegramBot } from "./telegram/bot.js";
import { realDeployScaffold } from "./ton/deploy.js";

export async function initCommand() {
  const answers = await inquirer.prompt([
    { name: "network", type: "list", choices: ["testnet", "mainnet"], default: "testnet", message: t("chooseNetwork") },
    { name: "lang", type: "list", choices: ["en", "ru", "uk", "af", "vi", "ar"], default: getConfig().lang || "en", message: "Language" },
    { name: "rpcUrl", type: "input", message: t("rpcPrompt") },
    { name: "wallet", type: "input", message: t("walletPrompt") }
  ]);
  Object.entries(answers).forEach(([k, v]) => setConfig(k, v));
  setLanguage(answers.lang);
  console.log(chalk.green("✓ " + t("configSaved")));
  console.log(getConfig());
}
export function configCommand(key, value) {
  if (!key) return console.log(getConfig());
  if (value === undefined) return console.log(getConfig()[key] ?? "");
  const cfg = setConfig(key, value);
  if (key === "lang") setLanguage(value);
  console.log(cfg);
}
function tokenFromOptions(options) {
  const cfg = getConfig();
  return parseToken({
    name: options.name,
    symbol: options.symbol,
    supply: options.supply,
    decimals: options.decimals ?? 9,
    liquidity: options.liquidity ?? 0,
    network: options.network ?? cfg.network,
    description: options.description ?? ""
  });
}
export async function auditCommand(options) {
  const token = tokenFromOptions(options);
  const spinner = ora(t("runningAudit")).start();
  await new Promise((r) => setTimeout(r, 250));
  const report = auditToken(token);
  spinner.succeed(`${t("auditCompleted")}: ${report.status} (${report.score}/100)`);
  if (options.json) console.log(JSON.stringify({ token, ...report }, null, 2));
  else {
    console.log(chalk.bold("\n" + t("checks")));
    for (const c of report.checks) console.log(`${c.pass ? chalk.green("✓") : chalk.red("✖")} [${c.severity}] ${c.id} — ${c.message}`);
  }
  if (options.out) console.log(chalk.green(`\n✓ ${t("reportWritten")}: ${await writeJson(options.out, { token, ...report })}`));
}
export async function metadataCommand(options) {
  const token = tokenFromOptions(options);
  console.log(chalk.green(`✓ ${t("metadataGenerated")}: ${await writeJson(options.out || `./${token.symbol.toLowerCase()}.metadata.json`, buildMetadata(token, options))}`));
}
export async function deployCommand(options) {
  const token = tokenFromOptions(options);
  const cmd = ["tg deploy", `--name "${token.name}"`, `--symbol ${token.symbol}`, `--supply ${token.supply}`, `--decimals ${token.decimals}`, `--liquidity ${token.liquidity}`, `--network ton-${token.network}`].join(" \\\n  ");
  const audit = auditToken(token);
  const receipt = { mode: options.dryRun ? "dry-run" : "simulated", command: cmd, estimatedGasTon: token.network === "mainnet" ? 0.05 : 0.01, predictedAddress: fakeAddress(JSON.stringify(token)), audit };
  console.log(chalk.cyan(`\n${t("generatedDeployCommand")}:\n`));
  console.log(cmd);
  console.log(chalk.gray(`\n${t("predictedAddress")}: ${receipt.predictedAddress}`));
  console.log(chalk.gray(`${t("estimatedGas")}: ${receipt.estimatedGasTon} TON`));
  console.log(chalk.gray(`Audit: ${audit.status} (${audit.score}/100)`));
  if (options.qr) qrcode.generate(cmd, { small: true });
  if (options.out) console.log(chalk.green(`\n✓ ${t("receiptWritten")}: ${await writeJson(options.out, receipt)}`));
}
export function statusCommand() {
  const cfg = getConfig();
  console.log(chalk.bold(t("localStatus")));
  console.log(`${t("network")} : ${cfg.network}`);
  console.log(`${t("rpc")}     : ${cfg.rpcUrl || "(" + t("notSet") + ")"}`);
  console.log(`${t("wallet")}  : ${cfg.wallet || "(" + t("notSet") + ")"}`);
  console.log(`Lang    : ${cfg.lang || "en"}`);
  console.log(`${t("agent")}   : ${t("utilityOfflineMode")}`);
}
export async function botCommand(options) { await startTelegramBot(options); }
export async function realDeployCommand(options) {
  const cfg = getConfig();
  console.log(chalk.yellow(t("realDeployWarning")));
  const result = await realDeployScaffold({ network: options.network || cfg.network, rpcUrl: options.rpcUrl || cfg.rpcUrl, mnemonic: process.env.TON_MNEMONIC });
  console.log(JSON.stringify(result, null, 2));
}
