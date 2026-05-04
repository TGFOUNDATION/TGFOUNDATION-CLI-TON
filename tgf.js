#!/usr/bin/env node
import { main } from "../src/index.js";

main(process.argv).catch((err) => {
  console.error("\n✖", err?.message || err);
  if (process.env.DEBUG) console.error(err);
  process.exit(1);
});
