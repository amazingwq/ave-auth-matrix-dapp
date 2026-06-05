import { BrowserProvider, Contract, getAddress } from "ethers";
import "./base.css";
import { ensureBsc, readableError } from "./chain.js";
import { loadDeployment } from "./deployment.js";
import { discoverProvider, getProviderDebugInfo, waitForProvider } from "./provider.js";
import {
  MATRIX_TARGET_COUNT,
  TARGET_SCENARIOS,
  detectScenario,
  matrixTargetIndex
} from "./scenarios.js";

const ERC20_ABI = ["function approve(address spender, uint256 amount) returns (bool)"];
const root = document.querySelector("#app");
const scenario = detectScenario(window.location);
const discovered = discoverProvider(window);

const state = {
  injectedProvider: discovered.provider,
  signer: null,
  account: "",
  deployment: null,
  busyIndex: null,
  statuses: Array(6).fill("等待连接钱包"),
  error: "",
  debugInfo: null
};

function shortAddress(address) {
  return address ? `${address.slice(0, 10)}...${address.slice(-8)}` : "合约准备中";
}

function render() {
  root.innerHTML = `
    <div class="simple-shell">
      <header class="simple-header">
        <div class="security-line">安全检测测试</div>
        <h1>DApp 授权测试</h1>
        <p>连接 Ave 钱包 · ERC-20 Approve</p>
        <span class="page-scenario" data-tone="${scenario.tone}">当前 DApp：${scenario.label}</span>
      </header>

      <section class="connect-panel">
        <div class="connection-state">
          <span class="connection-dot" data-connected="${Boolean(state.account)}"></span>
          <div>
            <strong>${state.account ? "已连接" : "未连接钱包"}</strong>
            <span>${state.account ? state.account : "请在 Ave DApp 浏览器中连接钱包"}</span>
            <span>${state.account ? "BSC Mainnet · Chain ID 56" : "连接后自动切换至 BSC 主网"}</span>
          </div>
        </div>
        <button class="connect-button" id="connect-button" ${state.account ? "disabled" : ""}>
          ${state.account ? "已连接 ✓" : "连接 Ave 钱包"}
        </button>
        ${state.error ? `<p class="inline-error">${state.error}</p>` : ""}
        ${state.debugInfo ? renderDebugInfo() : ""}
      </section>

      <section class="approval-section">
        <div class="section-heading">
          <div>
            <span>六种授权合约等级</span>
            <h2>固定授权数量：0.01 USDC</h2>
          </div>
          <span class="count-badge">6 个合约</span>
        </div>
        <div class="simple-cards">
          ${TARGET_SCENARIOS.map((target, index) => renderCard(target, index)).join("")}
        </div>
      </section>
    </div>
  `;

  document.querySelector("#connect-button").addEventListener("click", connectWallet);
  document.querySelectorAll(".copy-address").forEach((button) => {
    button.addEventListener("click", () => copyAddress(button));
  });
  document.querySelectorAll(".approve-button").forEach((button) => {
    button.addEventListener("click", () => approve(Number(button.dataset.index)));
  });
}

function renderDebugInfo() {
  return `
    <div class="debug-box">
      <strong>钱包检测信息</strong>
      <span>已发现对象：${state.debugInfo.detected.join(", ") || "无"}</span>
      <span>疑似 Provider：${state.debugInfo.providerLike.join(", ") || "无"}</span>
      <span>${state.debugInfo.userAgent}</span>
    </div>
  `;
}

function renderCard(target, index) {
  const address = currentTargets()[index] ?? "";
  const isBusy = state.busyIndex === index;
  const enabled = Boolean(state.signer && address && state.busyIndex === null);

  return `
    <article class="simple-card" data-key="${target.key}">
      <div class="simple-card-title">
        <div>
          <span class="scenario-number">场景 ${index + 1}</span>
          <h3>${target.label}授权</h3>
        </div>
        <span class="amount-badge">0.01 USDC</span>
      </div>
      <div class="contract-label">授权合约地址</div>
      <div class="contract-address">
        <code>${address || "尚未部署测试合约"}</code>
        <button
          class="copy-address"
          data-address="${address}"
          ${address ? "" : "disabled"}
        >复制</button>
      </div>
      <button class="approve-button" data-index="${index}" ${enabled ? "" : "disabled"}>
        ${isBusy ? "等待 Ave 钱包处理..." : `${target.label}授权`}
      </button>
      <p class="operation-status">${state.statuses[index]}</p>
    </article>
  `;
}

async function initialize() {
  try {
    state.deployment = await loadDeployment();
    if (state.deployment.targets.length === MATRIX_TARGET_COUNT) {
      state.statuses = Array(6).fill("连接钱包后可发起授权");
    } else {
      state.statuses = Array(6).fill("请先重新部署 36 个测试合约");
    }
  } catch (error) {
    state.error = readableError(error);
  }
  render();
}

async function connectWallet() {
  state.error = "";
  state.debugInfo = null;
  render();

  const latestProvider = await waitForProvider(window);
  state.injectedProvider = latestProvider.provider;

  if (!state.injectedProvider) {
    state.error = "未检测到钱包 Provider。请确认在 Ave DApp 浏览器中打开本页；如果刚进入页面，请刷新后再点连接。";
    state.debugInfo = getProviderDebugInfo(window);
    render();
    return;
  }

  try {
    const accounts = await state.injectedProvider.request({ method: "eth_requestAccounts" });
    state.account = getAddress(accounts[0]);
    await ensureBsc(state.injectedProvider);
    const browserProvider = new BrowserProvider(state.injectedProvider, "any");
    state.signer = await browserProvider.getSigner(state.account);
    state.deployment = await loadDeployment(browserProvider);
    state.statuses = state.deployment.targets.length === MATRIX_TARGET_COUNT
      ? Array(6).fill("已连接，可发起 0.01 USDC 授权")
      : Array(6).fill("请先重新部署 36 个测试合约");
  } catch (error) {
    state.error = readableError(error);
  }
  render();
}

async function approve(index) {
  const address = currentTargets()[index];
  if (!state.signer || !address) return;

  state.busyIndex = index;
  state.error = "";
  state.statuses[index] = `正在请求 ${TARGET_SCENARIOS[index].label}授权...`;
  render();

  try {
    const token = new Contract(state.deployment.token.address, ERC20_ABI, state.signer);
    const transaction = await token.approve(address, BigInt(state.deployment.token.approvalRawAmount));
    state.statuses[index] = `交易已发送：${shortAddress(transaction.hash)}`;
    render();
    await transaction.wait();
    state.statuses[index] = `授权成功：${shortAddress(transaction.hash)}`;
  } catch (error) {
    state.statuses[index] = `授权未完成：${readableError(error)}`;
  } finally {
    state.busyIndex = null;
    render();
  }
}

function currentTargets() {
  if (state.deployment?.targets?.length !== MATRIX_TARGET_COUNT) return [];
  return TARGET_SCENARIOS.map((_, index) => {
    return state.deployment.targets[matrixTargetIndex(scenario, index)];
  });
}

async function copyAddress(button) {
  await navigator.clipboard.writeText(button.dataset.address);
  button.textContent = "已复制";
  window.setTimeout(() => {
    button.textContent = "复制";
  }, 1200);
}

render();
initialize();
