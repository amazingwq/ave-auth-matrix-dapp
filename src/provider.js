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
    ["window.trustwallet", windowLike.trustwallet]
  ];

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

  while (!discovered.provider && Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => {
      windowLike.setTimeout?.(resolve, intervalMs) ?? setTimeout(resolve, intervalMs);
    });
    discovered = discoverProvider(windowLike);
  }

  return discovered;
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
