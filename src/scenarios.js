export const DAPP_SCENARIOS = [
  {
    key: "whitelist",
    label: "白名单",
    description: "后台白名单，默认低风险",
    host: "ave-auth-whitelist.pages.dev",
    tone: "trusted"
  },
  {
    key: "low",
    label: "AI低风险",
    description: "AI检测报告判定为低风险",
    host: "ave-auth-low.pages.dev",
    tone: "trusted"
  },
  {
    key: "unknown",
    label: "风险未知",
    description: "安全检测报告 AI 生成中",
    host: "ave-auth-unknown.pages.dev",
    tone: "unknown"
  },
  {
    key: "caution",
    label: "AI谨慎",
    description: "AI检测报告判定为谨慎",
    host: "ave-auth-caution.pages.dev",
    tone: "caution"
  },
  {
    key: "danger",
    label: "AI危险",
    description: "AI检测报告判定为危险",
    host: "ave-auth-danger.pages.dev",
    tone: "danger"
  },
  {
    key: "blacklist",
    label: "黑名单",
    description: "后台黑名单，默认危险",
    host: "ave-auth-blacklist.pages.dev",
    tone: "danger"
  }
];

export const TARGET_SCENARIOS = [
  { key: "whitelist", label: "白名单", description: "后台白名单，隐藏检测报告" },
  { key: "low", label: "AI低风险", description: "AI检测为低风险，显示检测报告" },
  { key: "unknown", label: "风险未知", description: "无检测报告，显示 AI 生成中" },
  { key: "caution", label: "AI谨慎", description: "AI检测为谨慎，显示检测报告" },
  { key: "danger", label: "AI危险", description: "AI检测为危险，禁止授权" },
  { key: "blacklist", label: "黑名单", description: "后台黑名单，隐藏检测报告并禁止授权" }
];

export function detectScenario(locationLike) {
  const queryScenario = new URLSearchParams(locationLike.search ?? "").get("scenario");
  const hostScenario = DAPP_SCENARIOS.find((scenario) => scenario.host === locationLike.hostname);
  const pathKey = (locationLike.pathname ?? "")
    .split("/")
    .filter(Boolean)
    .at(-1)
    ?.replace(/\.html$/, "");
  const pathScenario = DAPP_SCENARIOS.find((scenario) => scenario.key === pathKey);
  const requested = DAPP_SCENARIOS.find((scenario) => scenario.key === queryScenario);

  return requested ?? hostScenario ?? pathScenario ?? DAPP_SCENARIOS[2];
}

export function buildDappUrls(factoryAddress = "") {
  const suffix = factoryAddress ? `?factory=${factoryAddress}` : "";
  return DAPP_SCENARIOS.map((scenario) => ({
    ...scenario,
    url: `https://${scenario.host}/${suffix}`
  }));
}

export function buildSingleHostDappUrls(baseUrl, factoryAddress = "") {
  return DAPP_SCENARIOS.map((scenario) => {
    const url = new URL(`${scenario.key}.html`, baseUrl);
    if (factoryAddress) url.searchParams.set("factory", factoryAddress);
    return {
      ...scenario,
      url: url.toString()
    };
  });
}
