import{C as e,D as t,E as n,S as r,T as i,_ as a,b as o,c as s,d as c,f as l,g as u,i as d,l as f,m as p,o as m,p as h,r as g,t as _,u as v,v as y,w as b,x}from"./scenarios-CfcCnEO2.js";var S=class s{interface;bytecode;runner;constructor(n,r,i){let a=y.from(n);r instanceof Uint8Array?r=b(e(r)):(typeof r==`object`&&(r=r.object),r.startsWith(`0x`)||(r=`0x`+r),r=b(e(r))),t(this,{bytecode:r,interface:a,runner:i||null})}attach(e){return new p(e,this.interface,this.runner)}async getDeployTransaction(...e){let t={},n=this.interface.deploy;if(n.inputs.length+1===e.length&&(t=await u(e.pop())),n.inputs.length!==e.length)throw Error(`incorrect number of arguments to constructor`);let i=await a(this.runner,n.inputs,e),o=r([this.bytecode,this.interface.encodeDeploy(i)]);return Object.assign({},t,{data:o})}async deploy(...e){let t=await this.getDeployTransaction(...e);i(this.runner&&typeof this.runner.sendTransaction==`function`,`factory runner does not support sending transactions`,`UNSUPPORTED_OPERATION`,{operation:`sendTransaction`});let n=await this.runner.sendTransaction(t);return new p(o(n),this.interface,this.runner,n)}connect(e){return new s(this.interface,this.bytecode,e)}static fromSolidity(e,t){n(e!=null,`bad compiler output`,`output`,e),typeof e==`string`&&(e=JSON.parse(e));let r=e.abi,i=``;return e.bytecode?i=e.bytecode:e.evm&&e.evm.bytecode&&(i=e.evm.bytecode),new this(r,i,t)}},C=document.querySelector(`#app`),w=f(window),T={providerLabel:w.label,injectedProvider:w.provider,rawProvider:w.rawProvider,browserProvider:null,signer:null,account:``,chainId:``,factoryAddress:``,targets:[],transactionHash:``,status:`等待连接钱包`,error:``,busy:!1};function E(){C.innerHTML=`
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
            <span class="metric-value">${T.injectedProvider?T.providerLabel:`未检测到`}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Provider 类型</span>
            <span class="metric-value">${s(T.rawProvider)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">钱包地址</span>
            <span class="metric-value">${T.account||`未连接`}</span>
          </div>
          <div class="metric">
            <span class="metric-label">当前网络</span>
            <span class="metric-value">${T.chainId||`未连接`}</span>
          </div>
        </div>
        <div class="actions">
          <button class="primary" id="connect-button" ${T.busy?`disabled`:``}>连接钱包</button>
          <button class="secondary" id="deploy-button" ${T.signer&&!T.busy?``:`disabled`}>
            ${T.busy?`正在部署...`:`部署 Factory 与 36 个合约`}
          </button>
        </div>
        <p class="notice">${T.status}</p>
        ${T.error?`<p class="notice error">${T.error}</p>`:``}
      </section>

      <section class="panel">
        <h2>部署结果</h2>
        <div class="wallet-grid">
          <div class="metric">
            <span class="metric-label">Factory 地址</span>
            <span class="metric-value">${T.factoryAddress||`尚未部署`}</span>
          </div>
          <div class="metric">
            <span class="metric-label">部署交易</span>
            <span class="metric-value">${T.transactionHash?`<a href="https://bscscan.com/tx/${T.transactionHash}" target="_blank" rel="noreferrer">${T.transactionHash}</a>`:`尚未部署`}</span>
          </div>
        </div>
        <div class="matrix-groups" style="margin-top:16px">
          ${m(T.targets).map(e=>`
            <section class="matrix-group">
              <h3>${e.label} DApp</h3>
              <div class="cards">
                ${e.contracts.map(e=>`
                  <article class="card" data-key="${e.key}">
                    <span class="card-index">${e.label}授权</span>
                    <p class="address">${e.address||`尚未部署`}</p>
                  </article>
                `).join(``)}
              </div>
            </section>
          `).join(``)}
        </div>
      </section>

      <section class="panel">
        <h2>六个可配置 URL</h2>
        <p class="muted">优先使用六个独立 Host，兼容后端按域名识别 DApp 等级。</p>
        <ul class="url-list">
          ${g(T.factoryAddress).map(e=>`
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
          ${d(new URL(`./`,window.location.href),T.factoryAddress).map(e=>`
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
          <button class="secondary" id="copy-button" ${T.factoryAddress?``:`disabled`}>复制完整配置</button>
          <button class="ghost" id="download-button" ${T.factoryAddress?``:`disabled`}>下载部署 JSON</button>
        </div>
        <textarea class="config-output" readonly>${JSON.stringify(D(),null,2)}</textarea>
      </section>
    </div>
  `,document.querySelector(`#connect-button`).addEventListener(`click`,O),document.querySelector(`#deploy-button`).addEventListener(`click`,k),document.querySelector(`#copy-button`).addEventListener(`click`,A),document.querySelector(`#download-button`).addEventListener(`click`,j)}function D(){return{chain:`BSC Mainnet`,chainId:56,factoryAddress:T.factoryAddress,deploymentTransaction:T.transactionHash,dapps:g(T.factoryAddress).map(e=>({source:e.label,url:e.url})),singleHostFallbackDapps:d(new URL(`./`,window.location.href),T.factoryAddress).map(e=>({source:e.label,url:e.url})),authorizationContracts:m(T.targets).flatMap(e=>e.contracts.map(t=>({dappSource:e.label,dappUrl:d(new URL(`./`,window.location.href),T.factoryAddress).find(t=>t.key===e.key)?.url,contractSource:t.label,address:t.address})))}}async function O(){if(!T.injectedProvider){T.error=`未检测到 EVM 钱包 Provider。请在 Ave DApp 浏览器或安装钱包扩展的浏览器中打开本页。`,E();return}try{T.error=``,T.status=`正在请求钱包连接...`,T.busy=!0,E(),T.account=x((await T.injectedProvider.request({method:`eth_requestAccounts`}))[0]),T.chainId=await c(T.injectedProvider),T.browserProvider=new h(T.injectedProvider,`any`),T.signer=await T.browserProvider.getSigner(T.account),T.status=`钱包已连接，可以部署测试合约。`}catch(e){T.error=l(e),T.status=`钱包连接未完成。`}finally{T.busy=!1,E()}}async function k(){if(T.signer)try{T.error=``,T.busy=!0,T.status=`请在钱包中确认部署交易。`,E();let e=await new S(v.abi,v.bytecode,T.signer).deploy();if(T.transactionHash=e.deploymentTransaction().hash,T.status=`交易已发送：${T.transactionHash}，等待链上确认...`,E(),await e.waitForDeployment(),T.factoryAddress=await e.getAddress(),T.targets=(await e.getTargets()).map(x),T.targets.length!==_)throw Error(`部署结果数量异常：预期 ${_} 个，实际 ${T.targets.length} 个`);T.status=`36 个合约部署完成。请复制配置清单并交给后端配置风险等级。`}catch(e){T.error=l(e),T.status=`部署未完成。`}finally{T.busy=!1,E()}}async function A(){await navigator.clipboard.writeText(JSON.stringify(D(),null,2)),T.status=`完整配置已复制。`,E()}function j(){let e=new Blob([`${JSON.stringify(D(),null,2)}\n`],{type:`application/json`}),t=document.createElement(`a`);t.href=URL.createObjectURL(e),t.download=`ave-auth-matrix-bsc-mainnet.json`,t.click(),URL.revokeObjectURL(t.href)}E();