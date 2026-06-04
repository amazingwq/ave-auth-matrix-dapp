import{c as e,f as t,g as n,i as r,l as i,o as a,s as o,t as s,u as c,v as l}from"./scenarios-JYMCtXeq.js";var u=`./deployments/bsc-mainnet.json`;async function d(e){let r=await fetch(u,{cache:`no-store`});if(!r.ok)throw Error(`无法读取 BSC 部署配置`);let i=await r.json(),a=new URLSearchParams(window.location.search).get(`factory`)||i.factoryAddress;if(i.targets?.length===6)return{...i,factoryAddress:a,targets:i.targets.map(l)};if(a&&n(a)&&e){let n=await new t(l(a),o.abi,e).getTargets();return{...i,factoryAddress:l(a),targets:n.map(l)}}return{...i,factoryAddress:a,targets:[]}}var f=[`function approve(address spender, uint256 amount) returns (bool)`],p=document.querySelector(`#app`),m=r(window.location),h={injectedProvider:a(window).provider,signer:null,account:``,deployment:null,busyIndex:null,statuses:[,,,,,,].fill(`等待连接钱包`),error:``};function g(e){return e?`${e.slice(0,10)}...${e.slice(-8)}`:`合约准备中`}function _(){p.innerHTML=`
    <div class="simple-shell">
      <header class="simple-header">
        <div class="security-line">安全检测测试</div>
        <h1>DApp 授权测试</h1>
        <p>连接 Ave 钱包 · ERC-20 Approve</p>
        <span class="page-scenario" data-tone="${m.tone}">当前 DApp：${m.label}</span>
      </header>

      <section class="connect-panel">
        <div class="connection-state">
          <span class="connection-dot" data-connected="${!!h.account}"></span>
          <div>
            <strong>${h.account?`已连接`:`未连接钱包`}</strong>
            <span>${h.account?h.account:`请在 Ave DApp 浏览器中连接钱包`}</span>
            <span>${h.account?`BSC Mainnet · Chain ID 56`:`连接后自动切换至 BSC 主网`}</span>
          </div>
        </div>
        <button class="connect-button" id="connect-button" ${h.account?`disabled`:``}>
          ${h.account?`已连接 ✓`:`连接 Ave 钱包`}
        </button>
        ${h.error?`<p class="inline-error">${h.error}</p>`:``}
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
          ${s.map((e,t)=>v(e,t)).join(``)}
        </div>
      </section>
    </div>
  `,document.querySelector(`#connect-button`).addEventListener(`click`,b),document.querySelectorAll(`.copy-address`).forEach(e=>{e.addEventListener(`click`,()=>S(e))}),document.querySelectorAll(`.approve-button`).forEach(e=>{e.addEventListener(`click`,()=>x(Number(e.dataset.index)))})}function v(e,t){let n=h.deployment?.targets?.[t]??``,r=h.busyIndex===t,i=!!(h.signer&&n&&h.busyIndex===null);return`
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
      <p class="operation-status">${h.statuses[t]}</p>
    </article>
  `}async function y(){try{h.deployment=await d(),h.deployment.targets.length===6?h.statuses=[,,,,,,].fill(`连接钱包后可发起授权`):h.statuses=[,,,,,,].fill(`测试合约尚未部署`)}catch(e){h.error=i(e)}_()}async function b(){if(!h.injectedProvider){h.error=`未检测到 Ave 钱包，请在 Ave DApp 浏览器中打开本页面。`,_();return}try{h.error=``,h.account=l((await h.injectedProvider.request({method:`eth_requestAccounts`}))[0]),await e(h.injectedProvider);let t=new c(h.injectedProvider,`any`);h.signer=await t.getSigner(h.account),h.deployment=await d(t),h.statuses=h.deployment.targets.length===6?[,,,,,,].fill(`已连接，可发起 0.01 USDC 授权`):[,,,,,,].fill(`测试合约尚未部署`)}catch(e){h.error=i(e)}_()}async function x(e){let n=h.deployment?.targets?.[e];if(!(!h.signer||!n)){h.busyIndex=e,h.error=``,h.statuses[e]=`正在请求 ${s[e].label}授权...`,_();try{let r=await new t(h.deployment.token.address,f,h.signer).approve(n,BigInt(h.deployment.token.approvalRawAmount));h.statuses[e]=`交易已发送：${g(r.hash)}`,_(),await r.wait(),h.statuses[e]=`授权成功：${g(r.hash)}`}catch(t){h.statuses[e]=`授权未完成：${i(t)}`}finally{h.busyIndex=null,_()}}}async function S(e){await navigator.clipboard.writeText(e.dataset.address),e.textContent=`已复制`,window.setTimeout(()=>{e.textContent=`复制`},1200)}_(),y();