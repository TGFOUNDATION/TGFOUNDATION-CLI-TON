import Conf from "conf";
export const store = new Conf({
  projectName: "tg-foundation-utility-cli",
  defaults: { network: "testnet", rpcUrl: "", wallet: "", output: "text", lang: "en" }
});
export const getConfig = () => store.store;
export function setConfig(key, value) { store.set(key, value); return getConfig(); }
