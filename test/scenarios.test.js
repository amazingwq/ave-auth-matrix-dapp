import test from "node:test";
import assert from "node:assert/strict";
import {
  MATRIX_TARGET_COUNT,
  TARGET_SCENARIOS,
  buildDappUrls,
  buildSingleHostDappUrls,
  detectScenario,
  matrixRows,
  matrixTargetIndex
} from "../src/scenarios.js";

test("detects scenario from dedicated Cloudflare hostname", () => {
  const scenario = detectScenario({
    hostname: "ave-auth-blacklist.pages.dev",
    pathname: "/",
    search: ""
  });

  assert.equal(scenario.key, "blacklist");
});

test("detects scenario from path for local and fallback hosting", () => {
  const scenario = detectScenario({
    hostname: "localhost",
    pathname: "/caution.html",
    search: ""
  });

  assert.equal(scenario.key, "caution");
});

test("query scenario overrides hostname and path", () => {
  const scenario = detectScenario({
    hostname: "ave-auth-whitelist.pages.dev",
    pathname: "/whitelist/",
    search: "?scenario=danger"
  });

  assert.equal(scenario.key, "danger");
});

test("generates six distinct URLs with a shared factory address", () => {
  const factory = "0x1111111111111111111111111111111111111111";
  const urls = buildDappUrls(factory);

  assert.equal(urls.length, 6);
  assert.equal(new Set(urls.map((entry) => entry.url)).size, 6);
  assert.ok(urls.every((entry) => entry.url.endsWith(`?factory=${factory}`)));
});

test("generates six single-host fallback URLs", () => {
  const factory = "0x1111111111111111111111111111111111111111";
  const urls = buildSingleHostDappUrls("https://example.github.io/ave-auth-matrix-dapp/", factory);

  assert.equal(urls.length, 6);
  assert.equal(new Set(urls.map((entry) => entry.url)).size, 6);
  assert.ok(urls.every((entry) => entry.url.includes(".html")));
  assert.ok(urls.every((entry) => entry.url.includes(`factory=${factory}`)));
});

test("maps each DApp URL to six unique authorization contracts", () => {
  const targets = Array.from({ length: MATRIX_TARGET_COUNT }, (_, index) => `target-${index + 1}`);
  const rows = matrixRows(targets);

  assert.equal(rows.length, 6);
  assert.equal(rows.flatMap((row) => row.contracts).length, MATRIX_TARGET_COUNT);
  assert.equal(rows[0].contracts[0].address, "target-1");
  assert.equal(rows[5].contracts[5].address, "target-36");
  assert.equal(new Set(rows.flatMap((row) => row.contracts.map((contract) => contract.address))).size, 36);
});

test("calculates matrix target index by DApp row and authorization column", () => {
  assert.equal(matrixTargetIndex({ key: "whitelist" }, 0), 0);
  assert.equal(matrixTargetIndex({ key: "low" }, TARGET_SCENARIOS.length - 1), 11);
  assert.equal(matrixTargetIndex({ key: "blacklist" }, TARGET_SCENARIOS.length - 1), 35);
});
