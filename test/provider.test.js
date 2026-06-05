import test from "node:test";
import assert from "node:assert/strict";
import { discoverProvider, normalizeProvider, waitForProvider } from "../src/provider.js";

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
