import { Command } from "commander";
import { banner } from "./core/utils.js";
import { initCommand, configCommand, auditCommand, metadataCommand, deployCommand, statusCommand, botCommand, realDeployCommand } from "./commands.js";
import { getConfig } from "./core/config.js";
import { setLanguage, SUPPORTED_LANGS } from "./i18n.js";

export async function main(argv) {
  const cfg = getConfig();
  const program = new Command();
  program.name("tgf").description("TG FOUNDATION production utility CLI").version("2.0.0")
    .option("--lang <lang>", `Language: ${SUPPORTED_LANGS.join(", ")}`, cfg.lang || "en")
    .hook("preAction", (cmd) => { setLanguage(cmd.optsWithGlobals().lang || cfg.lang || "en"); banner(); });

  program.command("init").description("Create local config").action(initCommand);
  program.command("config [key] [value]").description("View or set config").action(configCommand);
  program.command("status").description("Show local status").action(statusCommand);

  const addTokenOptions = (c) => c.requiredOption("--name <name>", "Token name").requiredOption("--symbol <symbol>", "Token symbol").requiredOption("--supply <number>", "Total supply").option("--decimals <number>", "Decimals", "9").option("--liquidity <number>", "Initial liquidity in TON", "0").option("--network <network>", "mainnet or testnet").option("--description <text>", "Token description");

  addTokenOptions(program.command("audit").description("Audit token parameters")).option("--out <file>", "Write audit JSON").option("--json", "Print JSON").action(auditCommand);
  addTokenOptions(program.command("metadata").description("Generate metadata")).option("--image <url>", "Image URL").option("--telegram <url>", "Telegram URL").option("--website <url>", "Website URL").option("--x <url>", "X URL").option("--out <file>", "Output JSON file").action(metadataCommand);
  addTokenOptions(program.command("deploy").description("Generate deploy command")).option("--dry-run", "No external API", true).option("--qr", "Print QR").option("--out <file>", "Write receipt JSON").action(deployCommand);

  program.command("bot").description("Start Telegram bot mode").option("--lang <lang>", "Bot language", cfg.lang || "en").action(botCommand);
  program.command("ton-check").description("Check TON wallet/RPC scaffold from .env").option("--network <network>", "mainnet or testnet").option("--rpc-url <url>", "RPC URL").action(realDeployCommand);

  await program.parseAsync(argv);
}
