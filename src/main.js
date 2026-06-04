import {
  BrowserProvider,
  Contract,
  JsonRpcProvider,
  formatUnits,
  getAddress,
  isAddress
} from "ethers";
import "./base.css";
import { BSC_MAINNET, ensureBsc, readableError } from "./chain.js";
import { loadDeployment } from "./deployment.js";
import { describeProvider, discoverProvider } from "./provider.js";
import {
  TARGET_SCENARIOS,
  buildDappUrls,
  buildSingleHostDappUrls,
  detectScenario
} from "./scenarios.js";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

const root = document.querySelector("#app");
const scenario = detectScenario(window.location);
const discovered = discoverProvider(window);
const readProvider = new JsonRpcProvider(BSC_MAINNET.rpcUrls[0], BSC_MAINNET.chainId);

const state = {
  providerLabel: discovered.label,
  injectedProvider: discovered.provider,
  rawProvider: discovered.rawProvider,
  browserProvider: null,
  signer: null,
  account: "",
  chainId: "",
  lastRequest: "尚未请求",
  lastError: "",
  deployment: null,
  balance: null,
  allowances: Array(6).fill(null),
  cardStatuses: Array(6).fill("等待连接钱包"),
  busyCards: new Set(),
  busy: false
};

function shortAddress(address) {
  if (!address || !isAddress(address)) return "尚未部署";
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

function formatToken(rawValue) {
  if (rawValue === null || rawValue === undefined || !state.deployment) return "--";
  const decimals = state.deployment.token.decimals;
  return `${formatUnits(rawValue, decimals)} ${state.deployment.token.symbol}`;
}

function setRequest(method) {
  state.lastRequest = method;
  renderDiagnostics();
}

function setError(error) {
  state.lastError = error ? readableError(error) : "";
  renderDiagnostics();
}

function renderShell() {
  root.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Ave Authorization Matrix</p>
          <h1>六等级授权验收 DApp</h1>
          <p class="muted">当前页面用于触发不同授权合约等级，请仅用于测试验收。</p>
        </div>
        <span class="status-chip" data-tone="${scenario.tone}">${scenario.label}</span>
      </header>

      <section class="panel hero">
        <h2>当前 DApp 场景</h2>
        <div class="wallet-grid">
          <div class="metric">
            <span class="metric-label">等级来源</span>
            <span class="metric-value">${scenario.label}</span>
          </div>
          <div class="metric">
            <span class="metric-label">预期说明</span>
            <span class="metric-value">${scenario.description}</span>
          </div>
          <div class="metric">
            <span class="metric-label">当前 URL</span>
            <span class="metric-value">${window.location.href}</span>
          </div>
          <div class="metric">
            <span class="metric-label">授权代币</span>
            <span class="metric-value" id="token-address">读取中...</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2>钱包与网络</h2>
        <div class="wallet-grid">
          <div class="metric">
            <span class="metric-label">钱包地址</span>
            <span class="metric-value" id="wallet-address">未连接</span>
          </div>
          <div class="metric">
            <span class="metric-label">当前网络</span>
            <span class="metric-value" id="chain-id">未连接</span>
          </div>
          <div class="metric">
            <span class="metric-label">USDC 余额</span>
            <span class="metric-value" id="token-balance">--</span>
          </div>
          <div class="metric">
            <span class="metric-label">Factory 地址</span>
            <span class="metric-value" id="factory-address">读取中...</span>
          </div>
        </div>
        <div class="actions">
          <button class="primary" id="connect-button">连接 Ave 钱包</button>
          <button class="secondary" id="switch-button">切换 BSC 主网</button>
          <button class="ghost" id="refresh-button">刷新余额与授权</button>
          <button class="danger-button" id="revoke-button">撤销全部测试授权</button>
        </div>
        <p class="notice">
          每次授权数量固定为 USDC 最小单位 <strong>1</strong>，不是无限授权。六个测试目标合约没有
          <code>transferFrom</code> 或资产转移能力。
        </p>
        <p class="notice error" id="global-error" hidden></p>
      </section>

      <section class="panel">
        <h2>六个授权合约场景</h2>
        <div class="cards" id="target-cards"></div>
      </section>

      <section class="panel">
        <h2>连接诊断</h2>
        <div class="diagnostic-grid">
          <div class="metric">
            <span class="metric-label">Injected Provider</span>
            <span class="metric-value" id="provider-found">--</span>
          </div>
          <div class="metric">
            <span class="metric-label">Provider 类型</span>
            <span class="metric-value" id="provider-type">--</span>
          </div>
          <div class="metric">
            <span class="metric-label">最近请求</span>
            <span class="metric-value" id="last-request">--</span>
          </div>
          <div class="metric">
            <span class="metric-label">最近错误 / 拦截结果</span>
            <span class="metric-value" id="last-error">无</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2>后端配置清单</h2>
        <p class="muted">部署 Factory 后，本页面会自动生成六个 DApp URL 与六个授权合约地址。</p>
        <div class="actions">
          <button class="secondary" id="copy-config-button">复制完整配置</button>
          <a class="ghost" href="./deploy.html" style="display:inline-flex;align-items:center;text-decoration:none">部署测试合约</a>
        </div>
        <textarea class="config-output" id="config-output" readonly></textarea>
      </section>
    </div>
  `;

  document.querySelector("#connect-button").addEventListener("click", connectWallet);
  document.querySelector("#switch-button").addEventListener("click", switchChain);
  document.querySelector("#refresh-button").addEventListener("click", refreshWalletData);
  document.querySelector("#revoke-button").addEventListener("click", revokeAll);
  document.querySelector("#copy-config-button").addEventListener("click", copyBackendConfig);

  renderCards();
  renderDiagnostics();
  renderWallet();
  renderConfig();
}

function renderCards() {
  const container = document.querySelector("#target-cards");
  if (!container) return;

  container.innerHTML = TARGET_SCENARIOS.map((target, index) => {
    const address = state.deployment?.targets?.[index];
    const isBusy = state.busyCards.has(index);
    const canAuthorize = Boolean(state.signer && address && !isBusy);

    return `
      <article class="card" data-key="${target.key}">
        <div class="card-header">
          <div>
            <span class="card-index">授权合约 ${index + 1}</span>
            <h3>${target.label}</h3>
          </div>
          <span class="status-chip" data-tone="${
            ["danger", "blacklist"].includes(target.key)
              ? "danger"
              : target.key === "caution"
                ? "caution"
                : target.key === "unknown"
                  ? "unknown"
                  : "trusted"
          }">${target.label}</span>
        </div>
        <p class="muted">${target.description}</p>
        <div class="address-row">
          <span class="address">${address ?? "尚未配置 Factory 地址"}</span>
          <button class="copy" data-copy-address="${address ?? ""}" ${address ? "" : "disabled"}>复制</button>
        </div>
        <div class="metric">
          <span class="metric-label">当前授权额度</span>
          <span class="metric-value">${formatToken(state.allowances[index])}</span>
        </div>
        <div class="actions">
          <button class="primary authorize-button" data-index="${index}" ${canAuthorize ? "" : "disabled"}>
            ${isBusy ? "等待钱包处理..." : `授权给合约 ${index + 1}`}
          </button>
          <button class="ghost revoke-one-button" data-index="${index}" ${canAuthorize ? "" : "disabled"}>
            撤销
          </button>
        </div>
        <p class="card-status">${state.cardStatuses[index]}</p>
      </article>
    `;
  }).join("");

  container.querySelectorAll("[data-copy-address]").forEach((button) => {
    button.addEventListener("click", () => copyText(button.dataset.copyAddress, button));
  });
  container.querySelectorAll(".authorize-button").forEach((button) => {
    button.addEventListener("click", () => approveTarget(Number(button.dataset.index)));
  });
  container.querySelectorAll(".revoke-one-button").forEach((button) => {
    button.addEventListener("click", () => revokeTarget(Number(button.dataset.index)));
  });
}

function renderWallet() {
  const account = document.querySelector("#wallet-address");
  if (!account) return;

  account.textContent = state.account || "未连接";
  document.querySelector("#chain-id").textContent = state.chainId
    ? `${Number(state.chainId) === 56 ? "BSC 主网" : "非 BSC 主网"} (${state.chainId})`
    : "未连接";
  document.querySelector("#token-balance").textContent = formatToken(state.balance);
  document.querySelector("#factory-address").textContent =
    state.deployment?.factoryAddress || "尚未配置";
  document.querySelector("#token-address").textContent = state.deployment?.token?.address || "读取失败";
  document.querySelector("#connect-button").textContent = state.account ? "已连接 Ave 钱包" : "连接 Ave 钱包";
  document.querySelector("#revoke-button").disabled = !state.signer || state.busy;
  document.querySelector("#refresh-button").disabled = !state.account || state.busy;
}

function renderDiagnostics() {
  const found = document.querySelector("#provider-found");
  if (!found) return;

  found.textContent = state.injectedProvider ? `已检测到：${state.providerLabel}` : "未检测到";
  document.querySelector("#provider-type").textContent = describeProvider(state.rawProvider);
  document.querySelector("#last-request").textContent = state.lastRequest;
  document.querySelector("#last-error").textContent = state.lastError || "无";

  const errorBox = document.querySelector("#global-error");
  errorBox.hidden = !state.lastError;
  errorBox.textContent = state.lastError;
}

function backendConfig() {
  return {
    chain: "BSC Mainnet",
    chainId: 56,
    token: state.deployment?.token ?? null,
    factoryAddress: state.deployment?.factoryAddress ?? "",
    dapps: buildDappUrls(state.deployment?.factoryAddress ?? "").map((item) => ({
      source: item.label,
      url: item.url
    })),
    singleHostFallbackDapps: buildSingleHostDappUrls(
      new URL("./", window.location.href),
      state.deployment?.factoryAddress ?? ""
    ).map((item) => ({
      source: item.label,
      url: item.url
    })),
    authorizationContracts: TARGET_SCENARIOS.map((target, index) => ({
      source: target.label,
      address: state.deployment?.targets?.[index] ?? ""
    }))
  };
}

function renderConfig() {
  const output = document.querySelector("#config-output");
  if (output) output.value = JSON.stringify(backendConfig(), null, 2);
}

async function initializeDeployment() {
  try {
    state.deployment = await loadDeployment(readProvider);
    state.cardStatuses = state.deployment.targets.length === 6
      ? Array(6).fill("已加载授权合约，连接钱包后可测试")
      : Array(6).fill("请先打开部署页部署 Factory，再使用生成的测试 URL");
    renderWallet();
    renderCards();
    renderConfig();
  } catch (error) {
    setError(error);
  }
}

async function connectWallet() {
  if (!state.injectedProvider) {
    setError(new Error("未检测到 Ave 或其他 EVM 钱包注入 Provider，请在 Ave DApp 浏览器中打开本页。"));
    return;
  }

  try {
    setError(null);
    setRequest("eth_requestAccounts");
    const accounts = await state.injectedProvider.request({ method: "eth_requestAccounts" });
    state.account = getAddress(accounts[0]);

    state.chainId = await ensureBsc(state.injectedProvider, setRequest);
    state.browserProvider = new BrowserProvider(state.injectedProvider, "any");
    state.signer = await state.browserProvider.getSigner(state.account);
    state.deployment = await loadDeployment(state.browserProvider);

    registerProviderEvents();
    await refreshWalletData();
  } catch (error) {
    setError(error);
  } finally {
    renderWallet();
    renderCards();
    renderConfig();
  }
}

function registerProviderEvents() {
  if (typeof state.injectedProvider?.on !== "function" || state.eventsRegistered) return;
  state.eventsRegistered = true;

  state.injectedProvider.on("accountsChanged", (accounts) => {
    state.account = accounts?.[0] ? getAddress(accounts[0]) : "";
    state.signer = null;
    state.balance = null;
    state.allowances = Array(6).fill(null);
    renderWallet();
    renderCards();
  });

  state.injectedProvider.on("chainChanged", (chainId) => {
    state.chainId = chainId;
    renderWallet();
  });
}

async function switchChain() {
  if (!state.injectedProvider) {
    setError(new Error("未检测到钱包 Provider"));
    return;
  }

  try {
    setError(null);
    state.chainId = await ensureBsc(state.injectedProvider, setRequest);
    renderWallet();
  } catch (error) {
    setError(error);
  }
}

async function refreshWalletData() {
  if (!state.account || !state.deployment?.targets?.length) return;

  try {
    state.busy = true;
    setError(null);
    const token = new Contract(state.deployment.token.address, ERC20_ABI, readProvider);
    const [balance, ...allowances] = await Promise.all([
      token.balanceOf(state.account),
      ...state.deployment.targets.map((target) => token.allowance(state.account, target))
    ]);
    state.balance = balance;
    state.allowances = allowances;
    state.cardStatuses = state.cardStatuses.map(() => "额度已刷新");
  } catch (error) {
    setError(error);
  } finally {
    state.busy = false;
    renderWallet();
    renderCards();
  }
}

async function approveTarget(index) {
  return setAllowance(index, BigInt(state.deployment.token.approvalRawAmount), "授权");
}

async function revokeTarget(index) {
  return setAllowance(index, 0n, "撤销");
}

async function setAllowance(index, amount, verb) {
  if (!state.signer || !state.deployment?.targets?.[index]) return;

  state.busyCards.add(index);
  state.cardStatuses[index] = `正在请求 Ave 钱包${verb}...`;
  setError(null);
  renderCards();

  try {
    const token = new Contract(state.deployment.token.address, ERC20_ABI, state.signer);
    setRequest(`USDC.approve(${shortAddress(state.deployment.targets[index])}, ${amount})`);
    const transaction = await token.approve(state.deployment.targets[index], amount);
    state.cardStatuses[index] = `${verb}交易已发送：${transaction.hash}`;
    renderCards();
    await transaction.wait();
    state.cardStatuses[index] = `${verb}成功：${transaction.hash}`;
    await refreshWalletData();
  } catch (error) {
    state.cardStatuses[index] = `${verb}未完成：${readableError(error)}`;
    setError(error);
  } finally {
    state.busyCards.delete(index);
    renderCards();
  }
}

async function revokeAll() {
  if (!state.signer || !state.deployment?.targets?.length) return;

  state.busy = true;
  renderWallet();
  setError(null);

  for (let index = 0; index < state.deployment.targets.length; index += 1) {
    if (state.allowances[index] === 0n) {
      state.cardStatuses[index] = "无需撤销，当前额度为 0";
      continue;
    }
    await revokeTarget(index);
  }

  state.busy = false;
  renderWallet();
}

async function copyText(text, button) {
  if (!text) return;
  await navigator.clipboard.writeText(text);
  const previous = button?.textContent;
  if (button) {
    button.textContent = "已复制";
    window.setTimeout(() => {
      button.textContent = previous;
    }, 1200);
  }
}

async function copyBackendConfig() {
  const button = document.querySelector("#copy-config-button");
  await copyText(JSON.stringify(backendConfig(), null, 2), button);
}

renderShell();
initializeDeployment();
