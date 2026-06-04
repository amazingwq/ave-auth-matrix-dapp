# Ave 六等级授权矩阵测试 DApp

用于一次性验收 6 种 DApp 等级来源和 6 种授权合约等级来源，共 36 种综合授权场景。

## 核心能力

- 在 Ave 内置 DApp 浏览器中使用 injected EVM provider 连接 Ave 钱包。
- 连接 BSC 主网，使用 BSC USDC 固定发起 `0.01 USDC` 授权。
- 六个不同 Host 分别对应：白名单、AI低风险、风险未知、AI谨慎、AI危险、黑名单。
- 每个页面提供六个不同授权目标合约按钮，对应相同六种等级来源。
- 浏览器部署页一次性部署六个无资产转移能力的授权目标合约。
- 自动生成后端配置需要的六个 URL 和六个授权合约地址。

## 安全说明

`ApprovalTarget` 合约只有公开 `label`，不包含以下能力：

- 不包含 `transferFrom` 或任何资产转移调用。
- 不包含管理员执行、代理升级或销毁能力。
- 不接受原生 BNB。

DApp 默认对 BSC USDC 调用：

```solidity
USDC.approve(target, 10000000000000000)
```

其中 `10000000000000000` 在 18 位精度下为 `0.01 USDC`，不是无限授权。当前默认地址为 BSC 上的 Binance-Peg USD Coin：

`0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d`

正式验收前，请由 Ave 后端确认该地址会被当前授权检测逻辑识别。

## 本地运行

```bash
npm install
npm run dev
```

常用本地入口：

- `http://localhost:5173/whitelist.html`
- `http://localhost:5173/low.html`
- `http://localhost:5173/unknown.html`
- `http://localhost:5173/caution.html`
- `http://localhost:5173/danger.html`
- `http://localhost:5173/blacklist.html`
- `http://localhost:5173/deploy.html`

## 部署测试合约

1. 先将站点发布到任意 HTTPS 测试地址。
2. 在安装 EVM 钱包的浏览器或 Ave DApp 浏览器中打开 `/deploy.html`。
3. 点击「连接钱包」，切换到 BSC 主网。
4. 点击「部署 Factory 与六个合约」，在钱包内确认一次部署交易。
5. 部署完成后复制或下载页面生成的完整配置。

页面生成的测试 URL 会附带 `?factory=<地址>`，因此不需要重新构建网站即可读取六个目标地址。

部署页同时生成两套 URL：

- 六个独立 Cloudflare Host：兼容后端按域名或完整 URL 识别。
- 同一站点的六个查询参数 URL：未登录 Cloudflare 时可立即使用，要求后端按完整 URL 识别。

## 发布六个 Cloudflare Pages 站点

先登录 Cloudflare：

```bash
npx wrangler login
```

构建并发布同一份静态资源到六个项目：

```bash
npm run build
npm run deploy:cloudflare
```

预期站点：

- `https://ave-auth-whitelist.pages.dev`
- `https://ave-auth-low.pages.dev`
- `https://ave-auth-unknown.pages.dev`
- `https://ave-auth-caution.pages.dev`
- `https://ave-auth-danger.pages.dev`
- `https://ave-auth-blacklist.pages.dev`

Cloudflare 首次部署时可能要求创建对应 Pages 项目。六个站点均使用相同 `dist` 构建产物，前端根据 hostname 判断当前 DApp 场景。

## GitHub Pages 临时站点

发布同一站点的六个查询参数 URL，用于 Cloudflare 六站点上线前的联调：

```bash
npm run deploy:github-pages
```

首次发布后，需要在 GitHub 仓库设置中将 Pages 来源设为 `gh-pages` 分支根目录。

## Ave 联调检查

在 Ave 内置 DApp 浏览器打开任一生成 URL，依次确认：

1. 「连接 Ave 钱包」能够通过 injected provider 获取钱包地址。
2. 非 BSC 主网时能够请求切换至 `0x38`。
3. 点击授权按钮后，Ave 能识别 USDC `approve(spender, 1)`。
4. Ave 授权安全弹窗能显示当前 DApp 与目标授权合约综合等级。
5. 危险或黑名单场景被禁止，其余场景允许继续授权。
6. 白名单、黑名单隐藏检测报告入口，AI检测等级显示报告入口，未知显示 AI 生成中。

如果 Ave 未注入标准 `window.ethereum`，请将 Ave 专用 JS Bridge 接入
`src/provider.js` 的候选 provider 列表。
