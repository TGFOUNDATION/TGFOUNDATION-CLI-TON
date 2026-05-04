import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import { t } from "../i18n.js";
export function banner() {
  console.log(chalk.cyan.bold(t("bannerTitle")));
  console.log(chalk.gray(t("bannerSubtitle") + "\n"));
}
export function fakeAddress(seed) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  const hex = crypto.createHash("sha256").update(seed).digest("hex").slice(0, 44);
  return "EQ" + hex.replace(/[0-9a-f]/g, (c) => chars[parseInt(c, 16) + 10] || c);
}
export async function writeJson(file, data) {
  const resolved = path.resolve(file);
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, JSON.stringify(data, null, 2));
  return resolved;
}
