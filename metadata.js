export function buildMetadata(token, extra = {}) {
  return {
    name: token.name,
    symbol: token.symbol,
    description: token.description || `${token.name} (${token.symbol}) Jetton on TON`,
    decimals: token.decimals,
    image: extra.image || "",
    social: { telegram: extra.telegram || "", website: extra.website || "", x: extra.x || "" },
    attributes: [
      { trait_type: "Network", value: token.network },
      { trait_type: "Supply", value: String(token.supply) }
    ]
  };
}
