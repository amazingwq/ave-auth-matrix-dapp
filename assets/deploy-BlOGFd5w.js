import{A as e,D as t,E as n,M as r,O as i,_ as a,a as o,b as s,d as c,g as l,h as u,k as d,l as f,n as p,o as m,p as h,r as g,s as _,t as v,u as y,y as b}from"./scenarios-BrtBq6hs.js";var x=class o{interface;bytecode;runner;constructor(e,n,o){let s=a.from(e);n instanceof Uint8Array?n=i(t(n)):(typeof n==`object`&&(n=n.object),n.startsWith(`0x`)||(n=`0x`+n),n=i(t(n))),r(this,{bytecode:n,interface:s,runner:o||null})}attach(e){return new h(e,this.interface,this.runner)}async getDeployTransaction(...e){let t={},r=this.interface.deploy;if(r.inputs.length+1===e.length&&(t=await u(e.pop())),r.inputs.length!==e.length)throw Error(`incorrect number of arguments to constructor`);let i=await l(this.runner,r.inputs,e),a=n([this.bytecode,this.interface.encodeDeploy(i)]);return Object.assign({},t,{data:a})}async deploy(...e){let t=await this.getDeployTransaction(...e);d(this.runner&&typeof this.runner.sendTransaction==`function`,`factory runner does not support sending transactions`,`UNSUPPORTED_OPERATION`,{operation:`sendTransaction`});let n=await this.runner.sendTransaction(t);return new h(b(n),this.interface,this.runner,n)}connect(e){return new o(this.interface,this.bytecode,e)}static fromSolidity(t,n){e(t!=null,`bad compiler output`,`output`,t),typeof t==`string`&&(t=JSON.parse(t));let r=t.abi,i=``;return t.bytecode?i=t.bytecode:t.evm&&t.evm.bytecode&&(i=t.evm.bytecode),new this(r,i,n)}},S=document.querySelector(`#app`),C=m(window),w={providerLabel:C.label,injectedProvider:C.provider,browserProvider:null,signer:null,account:``,chainId:``,factoryAddress:``,targets:[],transactionHash:``,status:`等待连接钱包`,error:``,busy:!1};function T(){S.innerHTML=`
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Ave Authorization Matrix</p>
          <h1>部署六个安全测试授权合约</h1>
          <p class="muted">部署只需要一次交易。页面不会读取、上传或保存钱包私钥。</p>
        </div>
        <a class="ghost" href="./" style="display:inline-flex;align-items:center;text-decoration:none">返回测试 DApp</a>
      </header>

      <section class="panel hero">
        <h2>部署说明</h2>
        <p>
          Factory 会在 BSC 主网一次性创建六个不可升级的空目标合约。目标合约只有公开标签，
          没有 <code>transferFrom</code>、管理员执行或资产转移能力。
        </p>
        <p class="notice">
          部署需要少量 BNB Gas。部署完成后，请把本页生成的六个 URL 和六个授权合约地址交给后端配置。
        </p>
      </section>

      <section class="panel">
        <h2>钱包状态</h2>
        <div class="diagnostic-grid">
          <div class="metric">
            <span class="metric-label">Injected Provider</span>
            <span class="metric-value">${w.injectedProvider?w.providerLabel:`未检测到`}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Provider 类型</span>
            <span class="metric-value">${o(window.ethereum??window.web3?.currentProvider)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">钱包地址</span>
            <span class="metric-value">${w.account||`未连接`}</span>
          </div>
          <div class="metric">
            <span class="metric-label">当前网络</span>
            <span class="metric-value">${w.chainId||`未连接`}</span>
          </div>
        </div>
        <div class="actions">
          <button class="primary" id="connect-button" ${w.busy?`disabled`:``}>连接钱包</button>
          <button class="secondary" id="deploy-button" ${w.signer&&!w.busy?``:`disabled`}>
            ${w.busy?`正在部署...`:`部署 Factory 与六个合约`}
          </button>
        </div>
        <p class="notice">${w.status}</p>
        ${w.error?`<p class="notice error">${w.error}</p>`:``}
      </section>

      <section class="panel">
        <h2>部署结果</h2>
        <div class="wallet-grid">
          <div class="metric">
            <span class="metric-label">Factory 地址</span>
            <span class="metric-value">${w.factoryAddress||`尚未部署`}</span>
          </div>
          <div class="metric">
            <span class="metric-label">部署交易</span>
            <span class="metric-value">${w.transactionHash?`<a href="https://bscscan.com/tx/${w.transactionHash}" target="_blank" rel="noreferrer">${w.transactionHash}</a>`:`尚未部署`}</span>
          </div>
        </div>
        <div class="cards" style="margin-top:16px">
          ${v.map((e,t)=>`
            <article class="card" data-key="${e.key}">
              <span class="card-index">授权合约 ${t+1}</span>
              <h3>${e.label}</h3>
              <p class="address">${w.targets[t]??`尚未部署`}</p>
            </article>
          `).join(``)}
        </div>
      </section>

      <section class="panel">
        <h2>六个可配置 URL</h2>
        <p class="muted">优先使用六个独立 Host，兼容后端按域名识别 DApp 等级。</p>
        <ul class="url-list">
          ${p(w.factoryAddress).map(e=>`
            <li>
              <span>${e.label}</span>
              <a href="${e.url}" target="_blank" rel="noreferrer">${e.url}</a>
            </li>
          `).join(``)}
        </ul>
      </section>

      <section class="panel">
        <h2>单站点临时六 URL</h2>
        <p class="muted">未登录 Cloudflare 时可立即使用；仅适用于后端按完整 URL 识别 DApp 等级。</p>
        <ul class="url-list">
          ${g(new URL(`./`,window.location.href),w.factoryAddress).map(e=>`
            <li>
              <span>${e.label}</span>
              <a href="${e.url}" target="_blank" rel="noreferrer">${e.url}</a>
            </li>
          `).join(``)}
        </ul>
      </section>

      <section class="panel">
        <h2>后端配置清单</h2>
        <div class="actions">
          <button class="secondary" id="copy-button" ${w.factoryAddress?``:`disabled`}>复制完整配置</button>
          <button class="ghost" id="download-button" ${w.factoryAddress?``:`disabled`}>下载部署 JSON</button>
        </div>
        <textarea class="config-output" readonly>${JSON.stringify(E(),null,2)}</textarea>
      </section>
    </div>
  `,document.querySelector(`#connect-button`).addEventListener(`click`,D),document.querySelector(`#deploy-button`).addEventListener(`click`,O),document.querySelector(`#copy-button`).addEventListener(`click`,k),document.querySelector(`#download-button`).addEventListener(`click`,A)}function E(){return{chain:`BSC Mainnet`,chainId:56,factoryAddress:w.factoryAddress,deploymentTransaction:w.transactionHash,dapps:p(w.factoryAddress).map(e=>({source:e.label,url:e.url})),singleHostFallbackDapps:g(new URL(`./`,window.location.href),w.factoryAddress).map(e=>({source:e.label,url:e.url})),authorizationContracts:v.map((e,t)=>({source:e.label,address:w.targets[t]??``}))}}async function D(){if(!w.injectedProvider){w.error=`未检测到 EVM 钱包 Provider。请在 Ave DApp 浏览器或安装钱包扩展的浏览器中打开本页。`,T();return}try{w.error=``,w.status=`正在请求钱包连接...`,w.busy=!0,T(),w.account=s((await w.injectedProvider.request({method:`eth_requestAccounts`}))[0]),w.chainId=await f(w.injectedProvider),w.browserProvider=new c(w.injectedProvider,`any`),w.signer=await w.browserProvider.getSigner(w.account),w.status=`钱包已连接，可以部署测试合约。`}catch(e){w.error=y(e),w.status=`钱包连接未完成。`}finally{w.busy=!1,T()}}async function O(){if(w.signer)try{w.error=``,w.busy=!0,w.status=`请在钱包中确认部署交易。`,T();let e=await new x(_.abi,_.bytecode,w.signer).deploy();w.transactionHash=e.deploymentTransaction().hash,w.status=`交易已发送：${w.transactionHash}，等待链上确认...`,T(),await e.waitForDeployment(),w.factoryAddress=await e.getAddress(),w.targets=(await e.getTargets()).map(s),w.status=`部署完成。请复制配置清单并交给后端配置风险等级。`}catch(e){w.error=y(e),w.status=`部署未完成。`}finally{w.busy=!1,T()}}async function k(){await navigator.clipboard.writeText(JSON.stringify(E(),null,2)),w.status=`完整配置已复制。`,T()}function A(){let e=new Blob([`${JSON.stringify(E(),null,2)}\n`],{type:`application/json`}),t=document.createElement(`a`);t.href=URL.createObjectURL(e),t.download=`ave-auth-matrix-bsc-mainnet.json`,t.click(),URL.revokeObjectURL(t.href)}T();