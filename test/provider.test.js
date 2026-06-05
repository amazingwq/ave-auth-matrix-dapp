import test from "node:test";
import assert from "node:assert/strict";
import {
  discoverEip6963Provider,
  discoverProvider,
  getProviderDebugInfo,
  normalizeProvider,
  waitForProvider
} from "../src/provider.js";

test("discovers standard EIP-1193 provider", async () => {
  const ethereum = {
    isAve: true,
    async request({ method }) {
      return method;
    }
  };

  const discovered = discoverProvider({ ethereum });

  assert.equal(discovered.label, "window.ethereum");
  assert.equal(discovered.rawProvider, ethereum);
  assert.equal(await discovered.provider.request({ method: "eth_chainId" }), "eth_chainId");
});

test("wraps legacy web3 sendAsync provider", async () => {
  const legacy = {
    sendAsync(payload, callback) {
      callback(null, { result: payload.method });
    }
  };

  const discovered = discoverProvider({ web3: { currentProvider: legacy } });

  assert.equal(discovered.label, "window.web3.currentProvider");
  assert.equal(await discovered.provider.request({ method: "eth_requestAccounts" }), "eth_requestAccounts");
});

test("discovers provider from ethereum.providers array", async () => {
  const aveProvider = {
    isAve: true,
    async request({ method }) {
      return method;
    }
  };

  const discovered = discoverProvider({
    ethereum: {
      providers: [{}, aveProvider]
    }
  });

  assert.equal(discovered.label, "window.ethereum.providers[1]");
  assert.equal(discovered.rawProvider, aveProvider);
});

test("discovers provider from unknown wallet-like global", async () => {
  const windowLike = {
    aveInjectedProvider: {
      async request({ method }) {
        return method;
      }
    }
  };

  const discovered = discoverProvider(windowLike);

  assert.equal(discovered.label, "window.aveInjectedProvider");
});

test("discovers EIP-6963 provider announcements", async () => {
  const listeners = new Map();
  const provider = {
    async request({ method }) {
      return method;
    }
  };
  const windowLike = {
    addEventListener(name, handler) {
      listeners.set(name, handler);
    },
    removeEventListener(name) {
      listeners.delete(name);
    },
    dispatchEvent(event) {
      if (event.type !== "eip6963:requestProvider") return;
      setTimeout(() => {
        listeners.get("eip6963:announceProvider")?.({
          detail: {
            info: { name: "Ave Wallet", uuid: "ave" },
            provider
          }
        });
      }, 0);
    }
  };

  const discovered = await discoverEip6963Provider(windowLike, 20);

  assert.equal(discovered.label, "EIP-6963:Ave Wallet");
  assert.equal(discovered.rawProvider, provider);
});

test("waits for async provider injection", async () => {
  const windowLike = {
    ethereum: undefined,
    setTimeout
  };

  setTimeout(() => {
    windowLike.ethereum = {
      async request({ method }) {
        return method;
      }
    };
  }, 10);

  const discovered = await waitForProvider(windowLike, { timeoutMs: 200, intervalMs: 10 });

  assert.equal(discovered.label, "window.ethereum");
});

test("returns null for objects without an RPC request method", () => {
  assert.equal(normalizeProvider({}), null);
});

test("returns provider debug info", () => {
  const debugInfo = getProviderDebugInfo({
    ethereum: {},
    aveFooProvider: {
      async request() {}
    },
    navigator: { userAgent: "Ave Test" }
  });

  assert.deepEqual(debugInfo.detected, ["ethereum"]);
  assert.deepEqual(debugInfo.providerLike, ["window.aveFooProvider"]);
  assert.equal(debugInfo.userAgent, "Ave Test");
});
