import { BrowserProvider, ContractFactory, getAddress } from "ethers";
import "./base.css";
import factoryArtifact from "./generated/ApprovalMatrixFactory.json";
import { ensureBsc, readableError } from "./chain.js";
import { describeProvider, discoverProvider } from "./provider.js";
import {
  DAPP_SCENARIOS,
  MATRIX_TARGET_COUNT,
  TARGET_SCENARIOS,
  buildDappUrls,
  buildSingleHostDappUrls,
  matrixRows
} from "./scenarios.js";

const root = document.querySelector("#app");
const discovered = discoverProvider(window);

const state = {
  providerLabel: discovered.label,
  injectedProvider: discovered.provider,
  rawProvider: discovered.rawProvider,
  browserProvider: null,
  signer: null,
  account: "",
  chainId: "",
  factoryAddress: "",
  targets: [],
  transactionHash: "",
  status: "等待连接钱包",
  error: "",
  busy: false
};

function render() {
  root.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Ave Authorization Matrix</p>
          <h1>部署 36 个安全测试授权合约</h1>
          <p class="muted">部署只需要一次交易。页面不会读取、上传或保存钱包私钥。</p>
        </div>
        <a class="ghost" href="./" style="display:inline-flex;align-items:center;text-decoration:none">返回测试 DApp</a>
      </header>

      <section class="panel hero">
        <h2>部署说明</h2>
        <p>
          Factory 会在 BSC 主网一次性创建 36 个不可升级的空目标合约。目标合约只有公开标签，
          没有 <code>transferFrom</code>、管理员执行或资产转移能力。
        </p>
        <p class="notice">
          部署需要少量 BNB Gas。部署完成后，请把本页生成的六个 URL 和 36 个授权合约地址交给后端配置。
        </p>
      </section>

      <section class="panel">
        <h2>钱包状态</h2>
        <div class="diagnostic-grid">
          <div class="metric">
            <span class="metric-label">Injected Provider</span>
            <span class="metric-value">${state.injectedProvider ? state.providerLabel : "未检测到"}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Provider 类型</span>
            <span class="metric-value">${describeProvider(state.rawProvider)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">钱包地址</span>
            <span class="metric-value">${state.account || "未连接"}</span>
          </div>
          <div class="metric">
            <span class="metric-label">当前网络</span>
            <span class="metric-value">${state.chainId || "未连接"}</span>
          </div>
        </div>
        <div class="actions">
          <button class="primary" id="connect-button" ${state.busy ? "disabled" : ""}>连接钱包</button>
          <button class="secondary" id="deploy-button" ${state.signer && !state.busy ? "" : "disabled"}>
            ${state.busy ? "正在部署..." : "部署 Factory 与 36 个合约"}
          </button>
        </div>
        <p class="notice">${state.status}</p>
        ${state.error ? `<p class="notice error">${state.error}</p>` : ""}
      </section>

      <section class="panel">
        <h2>部署结果</h2>
        <div class="wallet-grid">
          <div class="metric">
            <span class="metric-label">Factory 地址</span>
            <span class="metric-value">${state.factoryAddress || "尚未部署"}</span>
          </div>
          <div class="metric">
            <span class="metric-label">部署交易</span>
            <span class="metric-value">${
              state.transactionHash
                ? `<a href="https://bscscan.com/tx/${state.transactionHash}" target="_blank" rel="noreferrer">${state.transactionHash}</a>`
                : "尚未部署"
            }</span>
          </div>
        </div>
        <div class="matrix-groups" style="margin-top:16px">
          ${matrixRows(state.targets).map((row) => `
            <section class="matrix-group">
              <h3>${row.label} DApp</h3>
              <div class="cards">
                ${row.contracts.map((target) => `
                  <article class="card" data-key="${target.key}">
                    <span class="card-index">${target.label}授权</span>
                    <p class="address">${target.address || "尚未部署"}</p>
                  </article>
                `).join("")}
              </div>
            </section>
          `).join("")}
        </div>
      </section>

      <section class="panel">
        <h2>六个可配置 URL</h2>
        <p class="muted">优先使用六个独立 Host，兼容后端按域名识别 DApp 等级。</p>
        <ul class="url-list">
          ${buildDappUrls(state.factoryAddress).map((item) => `
            <li>
              <span>${item.label}</span>
              <a href="${item.url}" target="_blank" rel="noreferrer">${item.url}</a>
            </li>
          `).join("")}
        </ul>
      </section>

      <section class="panel">
        <h2>单站点临时六 URL</h2>
        <p class="muted">未登录 Cloudflare 时可立即使用；仅适用于后端按完整 URL 识别 DApp 等级。</p>
        <ul class="url-list">
          ${buildSingleHostDappUrls(new URL("./", window.location.href), state.factoryAddress).map((item) => `
            <li>
              <span>${item.label}</span>
              <a href="${item.url}" target="_blank" rel="noreferrer">${item.url}</a>
            </li>
          `).join("")}
        </ul>
      </section>

      <section class="panel">
        <h2>后端配置清单</h2>
        <div class="actions">
          <button class="secondary" id="copy-button" ${state.factoryAddress ? "" : "disabled"}>复制完整配置</button>
          <button class="ghost" id="download-button" ${state.factoryAddress ? "" : "disabled"}>下载部署 JSON</button>
        </div>
        <textarea class="config-output" readonly>${JSON.stringify(buildConfig(), null, 2)}</textarea>
      </section>
    </div>
  `;

  document.querySelector("#connect-button").addEventListener("click", connect);
  document.querySelector("#deploy-button").addEventListener("click", deploy);
  document.querySelector("#copy-button").addEventListener("click", copyConfig);
  document.querySelector("#download-button").addEventListener("click", downloadConfig);
}

function buildConfig() {
  return {
    chain: "BSC Mainnet",
    chainId: 56,
    factoryAddress: state.factoryAddress,
    deploymentTransaction: state.transactionHash,
    dapps: buildDappUrls(state.factoryAddress).map((item) => ({
      source: item.label,
      url: item.url
    })),
    singleHostFallbackDapps: buildSingleHostDappUrls(
      new URL("./", window.location.href),
      state.factoryAddress
    ).map((item) => ({
      source: item.label,
      url: item.url
    })),
    authorizationContracts: matrixRows(state.targets).flatMap((row) =>
      row.contracts.map((target) => ({
        dappSource: row.label,
        dappUrl: buildSingleHostDappUrls(new URL("./", window.location.href), state.factoryAddress)
          .find((item) => item.key === row.key)?.url,
        contractSource: target.label,
        address: target.address
      }))
    )
  };
}

async function connect() {
  if (!state.injectedProvider) {
    state.error = "未检测到 EVM 钱包 Provider。请在 Ave DApp 浏览器或安装钱包扩展的浏览器中打开本页。";
    render();
    return;
  }

  try {
    state.error = "";
    state.status = "正在请求钱包连接...";
    state.busy = true;
    render();

    const accounts = await state.injectedProvider.request({ method: "eth_requestAccounts" });
    state.account = getAddress(accounts[0]);
    state.chainId = await ensureBsc(state.injectedProvider);
    state.browserProvider = new BrowserProvider(state.injectedProvider, "any");
    state.signer = await state.browserProvider.getSigner(state.account);
    state.status = "钱包已连接，可以部署测试合约。";
  } catch (error) {
    state.error = readableError(error);
    state.status = "钱包连接未完成。";
  } finally {
    state.busy = false;
    render();
  }
}

async function deploy() {
  if (!state.signer) return;

  try {
    state.error = "";
    state.busy = true;
    state.status = "请在钱包中确认部署交易。";
    render();

    const factory = new ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, state.signer);
    const contract = await factory.deploy();
    state.transactionHash = contract.deploymentTransaction().hash;
    state.status = `交易已发送：${state.transactionHash}，等待链上确认...`;
    render();

    await contract.waitForDeployment();
    state.factoryAddress = await contract.getAddress();
    const targets = await contract.getTargets();
    state.targets = targets.map(getAddress);
    if (state.targets.length !== MATRIX_TARGET_COUNT) {
      throw new Error(`部署结果数量异常：预期 ${MATRIX_TARGET_COUNT} 个，实际 ${state.targets.length} 个`);
    }
    state.status = "36 个合约部署完成。请复制配置清单并交给后端配置风险等级。";
  } catch (error) {
    state.error = readableError(error);
    state.status = "部署未完成。";
  } finally {
    state.busy = false;
    render();
  }
}

async function copyConfig() {
  await navigator.clipboard.writeText(JSON.stringify(buildConfig(), null, 2));
  state.status = "完整配置已复制。";
  render();
}

function downloadConfig() {
  const blob = new Blob([`${JSON.stringify(buildConfig(), null, 2)}\n`], {
    type: "application/json"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ave-auth-matrix-bsc-mainnet.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

render();
