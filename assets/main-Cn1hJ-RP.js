import{S as e,a as t,b as n,d as r,f as i,g as a,l as o,m as s,n as c,p as l,s as u,t as d,u as f}from"./scenarios-DJEv3QsP.js";var p=`./deployments/bsc-mainnet.json`;async function m(t){let i=await fetch(p,{cache:`no-store`});if(!i.ok)throw Error(`无法读取 BSC 部署配置`);let o=await i.json(),s=new URLSearchParams(window.location.search).get(`factory`)||o.factoryAddress;if(o.targets?.length>0)return{...o,factoryAddress:s,targets:o.targets.map(e)};if(s&&n(s)&&t){let n=await new a(e(s),r.abi,t).getTargets();return{...o,factoryAddress:e(s),targets:n.map(e)}}return{...o,factoryAddress:s,targets:[]}}var h=[`function approve(address spender, uint256 amount) returns (bool)`],g=document.querySelector(`#app`),_=t(window.location),v={injectedProvider:o(window).provider,signer:null,account:``,deployment:null,busyIndex:null,statuses:[,,,,,,].fill(`等待连接钱包`),error:``};function y(e){return e?`${e.slice(0,10)}...${e.slice(-8)}`:`合约准备中`}function b(){g.innerHTML=`
    <div class="simple-shell">
      <header class="simple-header">
        <div class="security-line">安全检测测试</div>
        <h1>DApp 授权测试</h1>
        <p>连接 Ave 钱包 · ERC-20 Approve</p>
        <span class="page-scenario" data-tone="${_.tone}">当前 DApp：${_.label}</span>
      </header>

      <section class="connect-panel">
        <div class="connection-state">
          <span class="connection-dot" data-connected="${!!v.account}"></span>
          <div>
            <strong>${v.account?`已连接`:`未连接钱包`}</strong>
            <span>${v.account?v.account:`请在 Ave DApp 浏览器中连接钱包`}</span>
            <span>${v.account?`BSC Mainnet · Chain ID 56`:`连接后自动切换至 BSC 主网`}</span>
          </div>
        </div>
        <button class="connect-button" id="connect-button" ${v.account?`disabled`:``}>
          ${v.account?`已连接 ✓`:`连接 Ave 钱包`}
        </button>
        ${v.error?`<p class="inline-error">${v.error}</p>`:``}
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
          ${c.map((e,t)=>x(e,t)).join(``)}
        </div>
      </section>
    </div>
  `,document.querySelector(`#connect-button`).addEventListener(`click`,C),document.querySelectorAll(`.copy-address`).forEach(e=>{e.addEventListener(`click`,()=>E(e))}),document.querySelectorAll(`.approve-button`).forEach(e=>{e.addEventListener(`click`,()=>w(Number(e.dataset.index)))})}function x(e,t){let n=T()[t]??``,r=v.busyIndex===t,i=!!(v.signer&&n&&v.busyIndex===null);return`
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
      <p class="operation-status">${v.statuses[t]}</p>
    </article>
  `}async function S(){try{v.deployment=await m(),v.deployment.targets.length===d?v.statuses=[,,,,,,].fill(`连接钱包后可发起授权`):v.statuses=[,,,,,,].fill(`请先重新部署 36 个测试合约`)}catch(e){v.error=l(e)}b()}async function C(){if(v.error=``,b(),v.injectedProvider=(await f(window)).provider,!v.injectedProvider){v.error=`未检测到钱包 Provider。请确认在 Ave DApp 浏览器中打开本页；如果刚进入页面，请刷新后再点连接。`,b();return}try{v.account=e((await v.injectedProvider.request({method:`eth_requestAccounts`}))[0]),await i(v.injectedProvider);let t=new s(v.injectedProvider,`any`);v.signer=await t.getSigner(v.account),v.deployment=await m(t),v.statuses=v.deployment.targets.length===d?[,,,,,,].fill(`已连接，可发起 0.01 USDC 授权`):[,,,,,,].fill(`请先重新部署 36 个测试合约`)}catch(e){v.error=l(e)}b()}async function w(e){let t=T()[e];if(!(!v.signer||!t)){v.busyIndex=e,v.error=``,v.statuses[e]=`正在请求 ${c[e].label}授权...`,b();try{let n=await new a(v.deployment.token.address,h,v.signer).approve(t,BigInt(v.deployment.token.approvalRawAmount));v.statuses[e]=`交易已发送：${y(n.hash)}`,b(),await n.wait(),v.statuses[e]=`授权成功：${y(n.hash)}`}catch(t){v.statuses[e]=`授权未完成：${l(t)}`}finally{v.busyIndex=null,b()}}}function T(){return v.deployment?.targets?.length===d?c.map((e,t)=>v.deployment.targets[u(_,t)]):[]}async function E(e){await navigator.clipboard.writeText(e.dataset.address),e.textContent=`已复制`,window.setTimeout(()=>{e.textContent=`复制`},1200)}b(),S();