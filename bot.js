import "dotenv/config";
import { Telegraf } from "telegraf";
import { parseToken } from "../core/validators.js";
import { auditToken } from "../core/audit.js";
import { buildMetadata } from "../core/metadata.js";
import { setLanguage, t } from "../i18n.js";

function parseArgs(text) {
  const pairs = {};
  const regex = /--([a-zA-Z]+)\s+([^--]+)/g;
  let m;
  while ((m = regex.exec(text))) pairs[m[1]] = m[2].trim().replace(/^"|"$/g, "");
  return pairs;
}

export async function startTelegramBot({ lang = "en" } = {}) {
  setLanguage(lang);
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is missing. Copy .env.example to .env first.");

  const bot = new Telegraf(token);

  bot.start((ctx) => ctx.reply("TG FOUNDATION Utility Bot\nCommands:\n/audit --name TEST --symbol TEST --supply 1000\n/metadata --name TEST --symbol TEST --supply 1000"));
  bot.command("audit", (ctx) => {
    try {
      const data = parseToken({ decimals: 9, liquidity: 0, network: "testnet", ...parseArgs(ctx.message.text) });
      const report = auditToken(data);
      ctx.reply(`${t("auditCompleted")}: ${report.status} (${report.score}/100)`);
    } catch (e) { ctx.reply("Error: " + e.message); }
  });
  bot.command("metadata", (ctx) => {
    try {
      const data = parseToken({ decimals: 9, liquidity: 0, network: "testnet", ...parseArgs(ctx.message.text) });
      ctx.reply("```json\n" + JSON.stringify(buildMetadata(data), null, 2) + "\n```", { parse_mode: "Markdown" });
    } catch (e) { ctx.reply("Error: " + e.message); }
  });

  await bot.launch();
  console.log(t("botStarted"));
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
