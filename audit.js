import { t } from "../i18n.js";
export function auditToken(token) {
  const checks = [];
  const add = (id, pass, severity, message) => checks.push({ id, pass, severity, message });
  add("symbol-format", /^[A-Z0-9]{2,12}$/.test(token.symbol), "medium", t("symbolFormat"));
  add("supply-range", token.supply > 0 && token.supply <= 1_000_000_000_000_000, "high", t("supplyRange"));
  add("decimals", token.decimals >= 0 && token.decimals <= 18, "medium", t("decimalsValid"));
  add("description", token.description?.length >= 20, "low", t("descriptionSuggested"));
  add("liquidity", token.network === "testnet" || token.liquidity > 0, "high", t("liquiditySuggested"));
  add("name-length", token.name.length <= 64, "low", t("nameLength"));
  const penalty = checks.reduce((sum, c) => sum + (c.pass ? 0 : c.severity === "high" ? 20 : c.severity === "medium" ? 10 : 5), 0);
  const score = Math.max(0, 100 - penalty);
  return { score, risk: 100 - score, status: score >= 85 ? "SAFE" : score >= 65 ? "REVIEW" : "RISKY", checks };
}
