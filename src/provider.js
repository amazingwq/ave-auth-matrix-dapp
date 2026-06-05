function requestWithCallback(provider, payload) {
  return new Promise((resolve, reject) => {
    const callback = (error, response) => {
      if (error) {
        reject(error);
        return;
      }
      if (response?.error) {
        reject(response.error);
        return;
      }
      resolve(response?.result);
    };

    if (typeof provider.sendAsync === "function") {
      provider.sendAsync(payload, callback);
      return;
    }
    provider.send(payload, callback);
  });
}

export function normalizeProvider(provider) {
  if (!provider) return null;
  if (typeof provider.request === "function") return provider;

  if (typeof provider.sendAsync === "function" || typeof provider.send === "function") {
    return {
      request({ method, params = [] }) {
        return requestWithCallback(provider, {
          jsonrpc: "2.0",
          id: Date.now(),
          method,
          params
        });
      },
      on: typeof provider.on === "function" ? provider.on.bind(provider) : undefined,
      removeListener:
        typeof provider.removeListener === "function"
          ? provider.removeListener.bind(provider)
          : undefined
    };
  }

  return null;
}

export function discoverProvider(windowLike = window) {
  const ethereumProviders = Array.isArray(windowLike.ethereum?.providers)
    ? windowLike.ethereum.providers.map((provider, index) => [
        `window.ethereum.providers[${index}]`,
        provider
      ])
    : [];
  const candidates = [
    ["window.ethereum", windowLike.ethereum],
    ...ethereumProviders,
    ["window.web3.currentProvider", windowLike.web3?.currentProvider],
    ["window.aveEthereum", windowLike.aveEthereum],
    ["window.aveWallet.ethereum", windowLike.aveWallet?.ethereum],
    ["window.ave.ethereum", windowLike.ave?.ethereum],
    ["window.BinanceChain", windowLike.BinanceChain],
    ["window.trustwallet", windowLike.trustwallet],
    ["window.okxwallet", windowLike.okxwallet],
    ["window.okxwallet.ethereum", windowLike.okxwallet?.ethereum],
    ["window.bitkeep.ethereum", windowLike.bitkeep?.ethereum],
    ["window.tokenpocket.ethereum", windowLike.tokenpocket?.ethereum],
    ["window.ethereumProvider", windowLike.ethereumProvider],
    ["window.web3Provider", windowLike.web3Provider]
  ];

  candidates.push(...discoverWindowProviderCandidates(windowLike));

  for (const [label, candidate] of candidates) {
    const provider = normalizeProvider(candidate);
    if (provider) {
      return { label, provider, rawProvider: candidate };
    }
  }

  return { label: "未检测到", provider: null, rawProvider: null };
}

export async function waitForProvider(windowLike = window, options = {}) {
  const timeoutMs = options.timeoutMs ?? 4000;
  const intervalMs = options.intervalMs ?? 120;
  const startedAt = Date.now();
  let discovered = discoverProvider(windowLike);
  if (discovered.provider) return discovered;

  discovered = await discoverEip6963Provider(windowLike, Math.min(800, timeoutMs));
  if (discovered.provider) return discovered;

  while (!discovered.provider && Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => {
      windowLike.setTimeout?.(resolve, intervalMs) ?? setTimeout(resolve, intervalMs);
    });
    discovered = discoverProvider(windowLike);
    if (discovered.provider) break;
    discovered = await discoverEip6963Provider(windowLike, 80);
  }

  return discovered;
}

export async function discoverEip6963Provider(windowLike = window, timeoutMs = 300) {
  if (
    typeof windowLike.addEventListener !== "function" ||
    typeof windowLike.removeEventListener !== "function" ||
    typeof windowLike.dispatchEvent !== "function"
  ) {
    return { label: "未检测到", provider: null, rawProvider: null };
  }

  const announcements = [];
  const onAnnouncement = (event) => {
    if (event?.detail?.provider) announcements.push(event.detail);
  };

  windowLike.addEventListener("eip6963:announceProvider", onAnnouncement);
  try {
    windowLike.dispatchEvent(new Event("eip6963:requestProvider"));
    await new Promise((resolve) => setTimeout(resolve, timeoutMs));
  } finally {
    windowLike.removeEventListener("eip6963:announceProvider", onAnnouncement);
  }

  const selected =
    announcements.find((item) => /ave/i.test(item.info?.name ?? "")) ?? announcements[0];
  const provider = normalizeProvider(selected?.provider);
  if (!provider) return { label: "未检测到", provider: null, rawProvider: null };

  return {
    label: `EIP-6963:${selected.info?.name ?? selected.info?.uuid ?? "wallet"}`,
    provider,
    rawProvider: selected.provider
  };
}

export function getProviderDebugInfo(windowLike = window) {
  const names = [
    "ethereum",
    "web3",
    "ave",
    "aveEthereum",
    "aveWallet",
    "ethereumProvider",
    "web3Provider",
    "BinanceChain",
    "trustwallet",
    "okxwallet",
    "bitkeep",
    "tokenpocket"
  ];
  const detected = names.filter((name) => Boolean(safeRead(windowLike, name)));
  const providerLike = discoverWindowProviderCandidates(windowLike).map(([label]) => label);
  return {
    detected,
    providerLike: [...new Set(providerLike)].slice(0, 12),
    userAgent: windowLike.navigator?.userAgent ?? ""
  };
}

function discoverWindowProviderCandidates(windowLike) {
  const labels = [];
  const seen = new Set();
  const properties = safeOwnPropertyNames(windowLike);
  const keywords = /(ethereum|web3|provider|wallet|ave|trust|okx|bitkeep|token|binance|bnb)/i;

  for (const property of properties) {
    if (!keywords.test(property)) continue;
    const value = safeRead(windowLike, property);
    pushProviderCandidate(labels, seen, `window.${property}`, value);
  }

  return labels;
}

function pushProviderCandidate(labels, seen, label, value) {
  if (!value || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);

  if (normalizeProvider(value)) labels.push([label, value]);

  for (const childKey of ["ethereum", "provider", "currentProvider", "web3Provider"]) {
    const child = safeRead(value, childKey);
    if (child && typeof child === "object" && !seen.has(child)) {
      if (normalizeProvider(child)) labels.push([`${label}.${childKey}`, child]);
      seen.add(child);
    }
  }
}

function safeOwnPropertyNames(value) {
  try {
    return Object.getOwnPropertyNames(value);
  } catch {
    return [];
  }
}

function safeRead(value, property) {
  try {
    return value?.[property];
  } catch {
    return undefined;
  }
}

export function describeProvider(rawProvider) {
  if (!rawProvider) return "无";
  const flags = [
    ["Ave", rawProvider.isAve],
    ["MetaMask", rawProvider.isMetaMask],
    ["Trust", rawProvider.isTrust],
    ["Binance", rawProvider.isBinance],
    ["TokenPocket", rawProvider.isTokenPocket]
  ]
    .filter(([, value]) => Boolean(value))
    .map(([name]) => name);

  return flags.length > 0 ? flags.join(" / ") : "Injected EIP-1193";
}
