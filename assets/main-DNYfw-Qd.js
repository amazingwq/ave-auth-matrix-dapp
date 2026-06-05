import{C as e,_ as t,a as n,d as r,f as i,h as a,l as o,m as s,n as c,p as l,s as u,t as d,u as f,x as p}from"./scenarios-CeVurLTR.js";var m=`./deployments/bsc-mainnet.json`;async function h(n){let r=await fetch(m,{cache:`no-store`});if(!r.ok)throw Error(`无法读取 BSC 部署配置`);let a=await r.json(),o=new URLSearchParams(window.location.search).get(`factory`)||a.factoryAddress;if(a.targets?.length>0)return{...a,factoryAddress:o,targets:a.targets.map(e)};if(o&&p(o)&&n){let r=await new t(e(o),i.abi,n).getTargets();return{...a,factoryAddress:e(o),targets:r.map(e)}}return{...a,factoryAddress:o,targets:[]}}var g=[`function approve(address spender, uint256 amount) returns (bool)`],_=document.querySelector(`#app`),v=n(window.location),y={injectedProvider:o(window).provider,signer:null,account:``,deployment:null,busyIndex:null,statuses:[,,,,,,].fill(`等待连接钱包`),error:``,debugInfo:null};function b(e){return e?`${e.slice(0,10)}...${e.slice(-8)}`:`合约准备中`}function x(){_.innerHTML=`
    <div class="simple-shell">
      <header class="simple-header">
        <div class="security-line">安全检测测试</div>
        <h1>DApp 授权测试</h1>
        <p>连接 Ave 钱包 · ERC-20 Approve</p>
        <span class="page-scenario" data-tone="${v.tone}">当前 DApp：${v.label}</span>
      </header>

      <section class="connect-panel">
        <div class="connection-state">
          <span class="connection-dot" data-connected="${!!y.account}"></span>
          <div>
            <strong>${y.account?`已连接`:`未连接钱包`}</strong>
            <span>${y.account?y.account:`请在 Ave DApp 浏览器中连接钱包`}</span>
            <span>${y.account?`BSC Mainnet · Chain ID 56`:`连接后自动切换至 BSC 主网`}</span>
          </div>
        </div>
        <button class="connect-button" id="connect-button" ${y.account?`disabled`:``}>
          ${y.account?`已连接 ✓`:`连接 Ave 钱包`}
        </button>
        ${y.error?`<p class="inline-error">${y.error}</p>`:``}
        ${y.debugInfo?S():``}
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
          ${c.map((e,t)=>C(e,t)).join(``)}
        </div>
      </section>
    </div>
  `,document.querySelector(`#connect-button`).addEventListener(`click`,T),document.querySelectorAll(`.copy-address`).forEach(e=>{e.addEventListener(`click`,()=>O(e))}),document.querySelectorAll(`.approve-button`).forEach(e=>{e.addEventListener(`click`,()=>E(Number(e.dataset.index)))})}function S(){return`
    <div class="debug-box">
      <strong>钱包检测信息</strong>
      <span>已发现对象：${y.debugInfo.detected.join(`, `)||`无`}</span>
      <span>疑似 Provider：${y.debugInfo.providerLike.join(`, `)||`无`}</span>
      <span>${y.debugInfo.userAgent}</span>
    </div>
  `}function C(e,t){let n=D()[t]??``,r=y.busyIndex===t,i=!!(y.signer&&n&&y.busyIndex===null);return`
    <article class="simple-card" data-key="${e.key}">
      <div class="simple-card-title">
        <div>
          <span class="scenario-number">场景 ${t+1}</span>
          <h3>${e.label}授权</h3>
        </div>
        <span class="amount-badge">0.01 USDC</span>
      </div>
      <div class="contract-label">授权合约地址</div>
      <div class="contract-address">
        <code>${n||`尚未部署测试合约`}</code>
        <button
          class="copy-address"
          data-address="${n}"
          ${n?``:`disabled`}
        >复制</button>
      </div>
      <button class="approve-button" data-index="${t}" ${i?``:`disabled`}>
        ${r?`等待 Ave 钱包处理...`:`${e.label}授权`}
      </button>
      <p class="operation-status">${y.statuses[t]}</p>
    </article>
  `}async function w(){try{y.deployment=await h(),y.deployment.targets.length===d?y.statuses=[,,,,,,].fill(`连接钱包后可发起授权`):y.statuses=[,,,,,,].fill(`请先重新部署 36 个测试合约`)}catch(e){y.error=s(e)}x()}async function T(){if(y.error=``,y.debugInfo=null,x(),y.injectedProvider=(await r(window)).provider,!y.injectedProvider){y.error=`未检测到钱包 Provider。请确认在 Ave DApp 浏览器中打开本页；如果刚进入页面，请刷新后再点连接。`,y.debugInfo=f(window),x();return}try{y.account=e((await y.injectedProvider.request({method:`eth_requestAccounts`}))[0]),await l(y.injectedProvider);let t=new a(y.injectedProvider,`any`);y.signer=await t.getSigner(y.account),y.deployment=await h(t),y.statuses=y.deployment.targets.length===d?[,,,,,,].fill(`已连接，可发起 0.01 USDC 授权`):[,,,,,,].fill(`请先重新部署 36 个测试合约`)}catch(e){y.error=s(e)}x()}async function E(e){let n=D()[e];if(!(!y.signer||!n)){y.busyIndex=e,y.error=``,y.statuses[e]=`正在请求 ${c[e].label}授权...`,x();try{let r=await new t(y.deployment.token.address,g,y.signer).approve(n,BigInt(y.deployment.token.approvalRawAmount));y.statuses[e]=`交易已发送：${b(r.hash)}`,x(),await r.wait(),y.statuses[e]=`授权成功：${b(r.hash)}`}catch(t){y.statuses[e]=`授权未完成：${s(t)}`}finally{y.busyIndex=null,x()}}}function D(){return y.deployment?.targets?.length===d?c.map((e,t)=>y.deployment.targets[u(v,t)]):[]}async function O(e){await navigator.clipboard.writeText(e.dataset.address),e.textContent=`已复制`,window.setTimeout(()=>{e.textContent=`复制`},1200)}x(),w();