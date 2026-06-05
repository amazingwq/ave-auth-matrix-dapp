import{a as e,d as t,f as n,h as r,l as i,n as a,p as o,s,t as c,u as l,x as u,y as d}from"./scenarios-CfcCnEO2.js";var f=`./deployments/bsc-mainnet.json`;async function p(e){let t=await fetch(f,{cache:`no-store`});if(!t.ok)throw Error(`无法读取 BSC 部署配置`);let n=await t.json(),i=new URLSearchParams(window.location.search).get(`factory`)||n.factoryAddress;if(n.targets?.length>0)return{...n,factoryAddress:i,targets:n.targets.map(u)};if(i&&d(i)&&e){let t=await new r(u(i),l.abi,e).getTargets();return{...n,factoryAddress:u(i),targets:t.map(u)}}return{...n,factoryAddress:i,targets:[]}}var m=[`function approve(address spender, uint256 amount) returns (bool)`],h=document.querySelector(`#app`),g=e(window.location),_={injectedProvider:i(window).provider,signer:null,account:``,deployment:null,busyIndex:null,statuses:[,,,,,,].fill(`等待连接钱包`),error:``};function v(e){return e?`${e.slice(0,10)}...${e.slice(-8)}`:`合约准备中`}function y(){h.innerHTML=`
    <div class="simple-shell">
      <header class="simple-header">
        <div class="security-line">安全检测测试</div>
        <h1>DApp 授权测试</h1>
        <p>连接 Ave 钱包 · ERC-20 Approve</p>
        <span class="page-scenario" data-tone="${g.tone}">当前 DApp：${g.label}</span>
      </header>

      <section class="connect-panel">
        <div class="connection-state">
          <span class="connection-dot" data-connected="${!!_.account}"></span>
          <div>
            <strong>${_.account?`已连接`:`未连接钱包`}</strong>
            <span>${_.account?_.account:`请在 Ave DApp 浏览器中连接钱包`}</span>
            <span>${_.account?`BSC Mainnet · Chain ID 56`:`连接后自动切换至 BSC 主网`}</span>
          </div>
        </div>
        <button class="connect-button" id="connect-button" ${_.account?`disabled`:``}>
          ${_.account?`已连接 ✓`:`连接 Ave 钱包`}
        </button>
        ${_.error?`<p class="inline-error">${_.error}</p>`:``}
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
          ${a.map((e,t)=>b(e,t)).join(``)}
        </div>
      </section>
    </div>
  `,document.querySelector(`#connect-button`).addEventListener(`click`,S),document.querySelectorAll(`.copy-address`).forEach(e=>{e.addEventListener(`click`,()=>T(e))}),document.querySelectorAll(`.approve-button`).forEach(e=>{e.addEventListener(`click`,()=>C(Number(e.dataset.index)))})}function b(e,t){let n=w()[t]??``,r=_.busyIndex===t,i=!!(_.signer&&n&&_.busyIndex===null);return`
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
      <p class="operation-status">${_.statuses[t]}</p>
    </article>
  `}async function x(){try{_.deployment=await p(),_.deployment.targets.length===c?_.statuses=[,,,,,,].fill(`连接钱包后可发起授权`):_.statuses=[,,,,,,].fill(`请先重新部署 36 个测试合约`)}catch(e){_.error=n(e)}y()}async function S(){if(!_.injectedProvider){_.error=`未检测到 Ave 钱包，请在 Ave DApp 浏览器中打开本页面。`,y();return}try{_.error=``,_.account=u((await _.injectedProvider.request({method:`eth_requestAccounts`}))[0]),await t(_.injectedProvider);let e=new o(_.injectedProvider,`any`);_.signer=await e.getSigner(_.account),_.deployment=await p(e),_.statuses=_.deployment.targets.length===c?[,,,,,,].fill(`已连接，可发起 0.01 USDC 授权`):[,,,,,,].fill(`请先重新部署 36 个测试合约`)}catch(e){_.error=n(e)}y()}async function C(e){let t=w()[e];if(!(!_.signer||!t)){_.busyIndex=e,_.error=``,_.statuses[e]=`正在请求 ${a[e].label}授权...`,y();try{let n=await new r(_.deployment.token.address,m,_.signer).approve(t,BigInt(_.deployment.token.approvalRawAmount));_.statuses[e]=`交易已发送：${v(n.hash)}`,y(),await n.wait(),_.statuses[e]=`授权成功：${v(n.hash)}`}catch(t){_.statuses[e]=`授权未完成：${n(t)}`}finally{_.busyIndex=null,y()}}}function w(){return _.deployment?.targets?.length===c?a.map((e,t)=>_.deployment.targets[s(g,t)]):[]}async function T(e){await navigator.clipboard.writeText(e.dataset.address),e.textContent=`已复制`,window.setTimeout(()=>{e.textContent=`复制`},1200)}y(),x();