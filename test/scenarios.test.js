import test from "node:test";
import assert from "node:assert/strict";
import { buildDappUrls, buildSingleHostDappUrls, detectScenario } from "../src/scenarios.js";

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
