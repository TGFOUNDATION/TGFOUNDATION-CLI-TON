import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALE_DIR = path.join(__dirname, "locales");
export const SUPPORTED_LANGS = ["en", "ru", "uk", "af", "vi", "ar"];
let currentLang = "en";
const cache = new Map();
function loadLocale(lang) {
  const safe = SUPPORTED_LANGS.includes(lang) ? lang : "en";
  if (!cache.has(safe)) cache.set(safe, JSON.parse(fs.readFileSync(path.join(LOCALE_DIR, `${safe}.json`), "utf8")));
  return cache.get(safe);
}
export function setLanguage(lang = "en") {
  currentLang = SUPPORTED_LANGS.includes(lang) ? lang : "en";
  return currentLang;
}
export function getLanguage() { return currentLang; }
export function t(key, vars = {}) {
  let text = loadLocale(currentLang)[key] || loadLocale("en")[key] || key;
  for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
  return text;
}
