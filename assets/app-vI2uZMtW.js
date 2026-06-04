import{A as e,C as t,D as n,M as r,S as i,T as a,a as o,b as s,c,d as l,f as u,i as ee,j as d,k as f,l as p,m,n as te,o as ne,r as h,s as g,t as _,u as v,v as y,w as b,x}from"./scenarios-KiYgJS78.js";for(var S=BigInt(-1),C=BigInt(0),w=BigInt(1),re=BigInt(5),T={},E=`0000`;E.length<80;)E+=E;function D(e){let t=E;for(;t.length<e;)t+=t;return BigInt(`1`+t.substring(0,e))}function O(e,t,n){let r=BigInt(t.width);if(t.signed){let t=w<<r-w;f(n==null||e>=-t&&e<t,`overflow`,`NUMERIC_FAULT`,{operation:n,fault:`overflow`,value:e}),e=e>C?x(b(e,r),r):-x(b(-e,r),r)}else{let t=w<<r;f(n==null||e>=0&&e<t,`overflow`,`NUMERIC_FAULT`,{operation:n,fault:`overflow`,value:e}),e=(e%t+t)%t&t-w}return e}function k(t){typeof t==`number`&&(t=`fixed128x${t}`);let n=!0,r=128,i=18;if(typeof t==`string`){if(t!==`fixed`)if(t===`ufixed`)n=!1;else{let a=t.match(/^(u?)fixed([0-9]+)x([0-9]+)$/);e(a,`invalid fixed format`,`format`,t),n=a[1]!==`u`,r=parseInt(a[2]),i=parseInt(a[3])}}else if(t){let a=t,o=(t,n,r)=>a[t]==null?r:(e(typeof a[t]===n,`invalid fixed format (`+t+` not `+n+`)`,`format.`+t,a[t]),a[t]);n=o(`signed`,`boolean`,n),r=o(`width`,`number`,r),i=o(`decimals`,`number`,i)}e(r%8==0,`invalid FixedNumber width (not byte aligned)`,`format.width`,r),e(i<=80,`invalid FixedNumber decimals (too large)`,`format.decimals`,i);let a=(n?``:`u`)+`fixed`+String(r)+`x`+String(i);return{signed:n,width:r,decimals:i,name:a}}function A(e,t){let n=``;e<C&&(n=`-`,e*=S);let r=e.toString();if(t===0)return n+r;for(;r.length<=t;)r=E+r;let i=r.length-t;for(r=r.substring(0,i)+`.`+r.substring(i);r[0]===`0`&&r[1]!==`.`;)r=r.substring(1);for(;r[r.length-1]===`0`&&r[r.length-2]!==`.`;)r=r.substring(0,r.length-1);return n+r}var ie=class o{format;#e;#t;#n;_value;constructor(e,t,n){d(e,T,`FixedNumber`),this.#t=t,this.#e=n;let i=A(t,n.decimals);r(this,{format:n.name,_value:i}),this.#n=D(n.decimals)}get signed(){return this.#e.signed}get width(){return this.#e.width}get decimals(){return this.#e.decimals}get value(){return this.#t}#r(t){e(this.format===t.format,`incompatible format; use fixedNumber.toFormat`,`other`,t)}#i(e,t){return e=O(e,this.#e,t),new o(T,e,this.#e)}#a(e,t){return this.#r(e),this.#i(this.#t+e.#t,t)}addUnsafe(e){return this.#a(e)}add(e){return this.#a(e,`add`)}#o(e,t){return this.#r(e),this.#i(this.#t-e.#t,t)}subUnsafe(e){return this.#o(e)}sub(e){return this.#o(e,`sub`)}#s(e,t){return this.#r(e),this.#i(this.#t*e.#t/this.#n,t)}mulUnsafe(e){return this.#s(e)}mul(e){return this.#s(e,`mul`)}mulSignal(e){this.#r(e);let t=this.#t*e.#t;return f(t%this.#n===C,`precision lost during signalling mul`,`NUMERIC_FAULT`,{operation:`mulSignal`,fault:`underflow`,value:this}),this.#i(t/this.#n,`mulSignal`)}#c(e,t){return f(e.#t!==C,`division by zero`,`NUMERIC_FAULT`,{operation:`div`,fault:`divide-by-zero`,value:this}),this.#r(e),this.#i(this.#t*this.#n/e.#t,t)}divUnsafe(e){return this.#c(e)}div(e){return this.#c(e,`div`)}divSignal(e){f(e.#t!==C,`division by zero`,`NUMERIC_FAULT`,{operation:`div`,fault:`divide-by-zero`,value:this}),this.#r(e);let t=this.#t*this.#n;return f(t%e.#t===C,`precision lost during signalling div`,`NUMERIC_FAULT`,{operation:`divSignal`,fault:`underflow`,value:this}),this.#i(t/e.#t,`divSignal`)}cmp(e){let t=this.value,n=e.value,r=this.decimals-e.decimals;return r>0?n*=D(r):r<0&&(t*=D(-r)),t<n?-1:+(t>n)}eq(e){return this.cmp(e)===0}lt(e){return this.cmp(e)<0}lte(e){return this.cmp(e)<=0}gt(e){return this.cmp(e)>0}gte(e){return this.cmp(e)>=0}floor(){let e=this.#t;return this.#t<C&&(e-=this.#n-w),e=this.#t/this.#n*this.#n,this.#i(e,`floor`)}ceiling(){let e=this.#t;return this.#t>C&&(e+=this.#n-w),e=this.#t/this.#n*this.#n,this.#i(e,`ceiling`)}round(e){if(e??=0,e>=this.decimals)return this;let t=this.decimals-e,n=re*D(t-1),r=this.value+n,i=D(t);return r=r/i*i,O(r,this.#e,`round`),new o(T,r,this.#e)}isZero(){return this.#t===C}isNegative(){return this.#t<C}toString(){return this._value}toUnsafeFloat(){return parseFloat(this.toString())}toFormat(e){return o.fromString(this.toString(),e)}static fromValue(e,n,r){let a=n==null?0:t(n),s=k(r),c=i(e,`value`),l=a-s.decimals;if(l>0){let t=D(l);f(c%t===C,`value loses precision for format`,`NUMERIC_FAULT`,{operation:`fromValue`,fault:`underflow`,value:e}),c/=t}else l<0&&(c*=D(-l));return O(c,s,`fromValue`),new o(T,c,s)}static fromString(t,n){let r=t.match(/^(-?)([0-9]*)\.?([0-9]*)$/);e(r&&r[2].length+r[3].length>0,`invalid FixedNumber string value`,`value`,t);let i=k(n),a=r[2]||`0`,s=r[3]||``;for(;s.length<i.decimals;)s+=E;f(s.substring(i.decimals).match(/^0*$/),`too many decimals for format`,`NUMERIC_FAULT`,{operation:`fromString`,fault:`underflow`,value:t}),s=s.substring(0,i.decimals);let c=BigInt(r[1]+a+s);return O(c,i,`fromString`),new o(T,c,i)}static fromBytes(e,t){let r=a(n(e,`value`)),i=k(t);return i.signed&&(r=x(r,i.width)),O(r,i,`fromBytes`),new o(T,r,i)}},ae=[`wei`,`kwei`,`mwei`,`gwei`,`szabo`,`finney`,`ether`];function oe(n,r){let i=18;if(typeof r==`string`){let t=ae.indexOf(r);e(t>=0,`invalid unit`,`unit`,r),i=3*t}else r!=null&&(i=t(r,`unit`));return ie.fromValue(n,i,{decimals:i,width:512}).toString()}var j=`./deployments/bsc-mainnet.json`;async function M(e){let t=await fetch(j,{cache:`no-store`});if(!t.ok)throw Error(`无法读取 BSC 部署配置`);let n=await t.json(),r=new URLSearchParams(window.location.search).get(`factory`)||n.factoryAddress;if(n.targets?.length===6)return{...n,factoryAddress:r,targets:n.targets.map(s)};if(r&&y(r)&&e){let t=await new m(s(r),g.abi,e).getTargets();return{...n,factoryAddress:s(r),targets:t.map(s)}}return{...n,factoryAddress:r,targets:[]}}var N=[`function balanceOf(address owner) view returns (uint256)`,`function allowance(address owner, address spender) view returns (uint256)`,`function approve(address spender, uint256 amount) returns (bool)`],P=document.querySelector(`#app`),F=ee(window.location),I=ne(window),L=new u(c.rpcUrls[0],c.chainId),R={providerLabel:I.label,injectedProvider:I.provider,rawProvider:I.rawProvider,browserProvider:null,signer:null,account:``,chainId:``,lastRequest:`尚未请求`,lastError:``,deployment:null,balance:null,allowances:[,,,,,,].fill(null),cardStatuses:[,,,,,,].fill(`等待连接钱包`),busyCards:new Set,busy:!1};function z(e){return!e||!y(e)?`尚未部署`:`${e.slice(0,8)}...${e.slice(-6)}`}function B(e){if(e==null||!R.deployment)return`--`;let t=R.deployment.token.decimals;return`${oe(e,t)} ${R.deployment.token.symbol}`}function V(e){R.lastRequest=e,K()}function H(e){R.lastError=e?v(e):``,K()}function U(){P.innerHTML=`
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Ave Authorization Matrix</p>
          <h1>六等级授权验收 DApp</h1>
          <p class="muted">当前页面用于触发不同授权合约等级，请仅用于测试验收。</p>
        </div>
        <span class="status-chip" data-tone="${F.tone}">${F.label}</span>
      </header>

      <section class="panel hero">
        <h2>当前 DApp 场景</h2>
        <div class="wallet-grid">
          <div class="metric">
            <span class="metric-label">等级来源</span>
            <span class="metric-value">${F.label}</span>
          </div>
          <div class="metric">
            <span class="metric-label">预期说明</span>
            <span class="metric-value">${F.description}</span>
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
  `,document.querySelector(`#connect-button`).addEventListener(`click`,ce),document.querySelector(`#switch-button`).addEventListener(`click`,Y),document.querySelector(`#refresh-button`).addEventListener(`click`,X),document.querySelector(`#revoke-button`).addEventListener(`click`,de),document.querySelector(`#copy-config-button`).addEventListener(`click`,fe),W(),K(),G(),J()}function W(){let e=document.querySelector(`#target-cards`);e&&(e.innerHTML=_.map((e,t)=>{let n=R.deployment?.targets?.[t],r=R.busyCards.has(t),i=!!(R.signer&&n&&!r);return`
      <article class="card" data-key="${e.key}">
        <div class="card-header">
          <div>
            <span class="card-index">授权合约 ${t+1}</span>
            <h3>${e.label}</h3>
          </div>
          <span class="status-chip" data-tone="${[`danger`,`blacklist`].includes(e.key)?`danger`:e.key===`caution`?`caution`:e.key===`unknown`?`unknown`:`trusted`}">${e.label}</span>
        </div>
        <p class="muted">${e.description}</p>
        <div class="address-row">
          <span class="address">${n??`尚未配置 Factory 地址`}</span>
          <button class="copy" data-copy-address="${n??``}" ${n?``:`disabled`}>复制</button>
        </div>
        <div class="metric">
          <span class="metric-label">当前授权额度</span>
          <span class="metric-value">${B(R.allowances[t])}</span>
        </div>
        <div class="actions">
          <button class="primary authorize-button" data-index="${t}" ${i?``:`disabled`}>
            ${r?`等待钱包处理...`:`授权给合约 ${t+1}`}
          </button>
          <button class="ghost revoke-one-button" data-index="${t}" ${i?``:`disabled`}>
            撤销
          </button>
        </div>
        <p class="card-status">${R.cardStatuses[t]}</p>
      </article>
    `}).join(``),e.querySelectorAll(`[data-copy-address]`).forEach(e=>{e.addEventListener(`click`,()=>$(e.dataset.copyAddress,e))}),e.querySelectorAll(`.authorize-button`).forEach(e=>{e.addEventListener(`click`,()=>ue(Number(e.dataset.index)))}),e.querySelectorAll(`.revoke-one-button`).forEach(e=>{e.addEventListener(`click`,()=>Z(Number(e.dataset.index)))}))}function G(){let e=document.querySelector(`#wallet-address`);e&&(e.textContent=R.account||`未连接`,document.querySelector(`#chain-id`).textContent=R.chainId?`${Number(R.chainId)===56?`BSC 主网`:`非 BSC 主网`} (${R.chainId})`:`未连接`,document.querySelector(`#token-balance`).textContent=B(R.balance),document.querySelector(`#factory-address`).textContent=R.deployment?.factoryAddress||`尚未配置`,document.querySelector(`#token-address`).textContent=R.deployment?.token?.address||`读取失败`,document.querySelector(`#connect-button`).textContent=R.account?`已连接 Ave 钱包`:`连接 Ave 钱包`,document.querySelector(`#revoke-button`).disabled=!R.signer||R.busy,document.querySelector(`#refresh-button`).disabled=!R.account||R.busy)}function K(){let e=document.querySelector(`#provider-found`);if(!e)return;e.textContent=R.injectedProvider?`已检测到：${R.providerLabel}`:`未检测到`,document.querySelector(`#provider-type`).textContent=o(R.rawProvider),document.querySelector(`#last-request`).textContent=R.lastRequest,document.querySelector(`#last-error`).textContent=R.lastError||`无`;let t=document.querySelector(`#global-error`);t.hidden=!R.lastError,t.textContent=R.lastError}function q(){return{chain:`BSC Mainnet`,chainId:56,token:R.deployment?.token??null,factoryAddress:R.deployment?.factoryAddress??``,dapps:te(R.deployment?.factoryAddress??``).map(e=>({source:e.label,url:e.url})),singleHostFallbackDapps:h(new URL(`./`,window.location.href),R.deployment?.factoryAddress??``).map(e=>({source:e.label,url:e.url})),authorizationContracts:_.map((e,t)=>({source:e.label,address:R.deployment?.targets?.[t]??``}))}}function J(){let e=document.querySelector(`#config-output`);e&&(e.value=JSON.stringify(q(),null,2))}async function se(){try{R.deployment=await M(L),R.cardStatuses=R.deployment.targets.length===6?[,,,,,,].fill(`已加载授权合约，连接钱包后可测试`):[,,,,,,].fill(`请先打开部署页部署 Factory，再使用生成的测试 URL`),G(),W(),J()}catch(e){H(e)}}async function ce(){if(!R.injectedProvider){H(Error(`未检测到 Ave 或其他 EVM 钱包注入 Provider，请在 Ave DApp 浏览器中打开本页。`));return}try{H(null),V(`eth_requestAccounts`),R.account=s((await R.injectedProvider.request({method:`eth_requestAccounts`}))[0]),R.chainId=await p(R.injectedProvider,V),R.browserProvider=new l(R.injectedProvider,`any`),R.signer=await R.browserProvider.getSigner(R.account),R.deployment=await M(R.browserProvider),le(),await X()}catch(e){H(e)}finally{G(),W(),J()}}function le(){typeof R.injectedProvider?.on!=`function`||R.eventsRegistered||(R.eventsRegistered=!0,R.injectedProvider.on(`accountsChanged`,e=>{R.account=e?.[0]?s(e[0]):``,R.signer=null,R.balance=null,R.allowances=[,,,,,,].fill(null),G(),W()}),R.injectedProvider.on(`chainChanged`,e=>{R.chainId=e,G()}))}async function Y(){if(!R.injectedProvider){H(Error(`未检测到钱包 Provider`));return}try{H(null),R.chainId=await p(R.injectedProvider,V),G()}catch(e){H(e)}}async function X(){if(!(!R.account||!R.deployment?.targets?.length))try{R.busy=!0,H(null);let e=new m(R.deployment.token.address,N,L),[t,...n]=await Promise.all([e.balanceOf(R.account),...R.deployment.targets.map(t=>e.allowance(R.account,t))]);R.balance=t,R.allowances=n,R.cardStatuses=R.cardStatuses.map(()=>`额度已刷新`)}catch(e){H(e)}finally{R.busy=!1,G(),W()}}async function ue(e){return Q(e,BigInt(R.deployment.token.approvalRawAmount),`授权`)}async function Z(e){return Q(e,0n,`撤销`)}async function Q(e,t,n){if(!(!R.signer||!R.deployment?.targets?.[e])){R.busyCards.add(e),R.cardStatuses[e]=`正在请求 Ave 钱包${n}...`,H(null),W();try{let r=new m(R.deployment.token.address,N,R.signer);V(`USDC.approve(${z(R.deployment.targets[e])}, ${t})`);let i=await r.approve(R.deployment.targets[e],t);R.cardStatuses[e]=`${n}交易已发送：${i.hash}`,W(),await i.wait(),R.cardStatuses[e]=`${n}成功：${i.hash}`,await X()}catch(t){R.cardStatuses[e]=`${n}未完成：${v(t)}`,H(t)}finally{R.busyCards.delete(e),W()}}}async function de(){if(!(!R.signer||!R.deployment?.targets?.length)){R.busy=!0,G(),H(null);for(let e=0;e<R.deployment.targets.length;e+=1){if(R.allowances[e]===0n){R.cardStatuses[e]=`无需撤销，当前额度为 0`;continue}await Z(e)}R.busy=!1,G()}}async function $(e,t){if(!e)return;await navigator.clipboard.writeText(e);let n=t?.textContent;t&&(t.textContent=`已复制`,window.setTimeout(()=>{t.textContent=n},1200))}async function fe(){let e=document.querySelector(`#copy-config-button`);await $(JSON.stringify(q(),null,2),e)}U(),se();