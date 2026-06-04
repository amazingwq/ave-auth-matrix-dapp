import{A as e,C as t,D as n,M as r,S as i,T as a,a as o,b as s,c,d as l,f as u,i as ee,j as d,k as f,l as p,m,n as h,o as g,r as _,s as v,t as y,u as b,v as x,w as S,x as C}from"./scenarios-BrtBq6hs.js";for(var w=BigInt(-1),T=BigInt(0),E=BigInt(1),te=BigInt(5),D={},O=`0000`;O.length<80;)O+=O;function k(e){let t=O;for(;t.length<e;)t+=t;return BigInt(`1`+t.substring(0,e))}function A(e,t,n){let r=BigInt(t.width);if(t.signed){let t=E<<r-E;f(n==null||e>=-t&&e<t,`overflow`,`NUMERIC_FAULT`,{operation:n,fault:`overflow`,value:e}),e=e>T?C(S(e,r),r):-C(S(-e,r),r)}else{let t=E<<r;f(n==null||e>=0&&e<t,`overflow`,`NUMERIC_FAULT`,{operation:n,fault:`overflow`,value:e}),e=(e%t+t)%t&t-E}return e}function j(t){typeof t==`number`&&(t=`fixed128x${t}`);let n=!0,r=128,i=18;if(typeof t==`string`){if(t!==`fixed`)if(t===`ufixed`)n=!1;else{let a=t.match(/^(u?)fixed([0-9]+)x([0-9]+)$/);e(a,`invalid fixed format`,`format`,t),n=a[1]!==`u`,r=parseInt(a[2]),i=parseInt(a[3])}}else if(t){let a=t,o=(t,n,r)=>a[t]==null?r:(e(typeof a[t]===n,`invalid fixed format (`+t+` not `+n+`)`,`format.`+t,a[t]),a[t]);n=o(`signed`,`boolean`,n),r=o(`width`,`number`,r),i=o(`decimals`,`number`,i)}e(r%8==0,`invalid FixedNumber width (not byte aligned)`,`format.width`,r),e(i<=80,`invalid FixedNumber decimals (too large)`,`format.decimals`,i);let a=(n?``:`u`)+`fixed`+String(r)+`x`+String(i);return{signed:n,width:r,decimals:i,name:a}}function ne(e,t){let n=``;e<T&&(n=`-`,e*=w);let r=e.toString();if(t===0)return n+r;for(;r.length<=t;)r=O+r;let i=r.length-t;for(r=r.substring(0,i)+`.`+r.substring(i);r[0]===`0`&&r[1]!==`.`;)r=r.substring(1);for(;r[r.length-1]===`0`&&r[r.length-2]!==`.`;)r=r.substring(0,r.length-1);return n+r}var re=class o{format;#e;#t;#n;_value;constructor(e,t,n){d(e,D,`FixedNumber`),this.#t=t,this.#e=n;let i=ne(t,n.decimals);r(this,{format:n.name,_value:i}),this.#n=k(n.decimals)}get signed(){return this.#e.signed}get width(){return this.#e.width}get decimals(){return this.#e.decimals}get value(){return this.#t}#r(t){e(this.format===t.format,`incompatible format; use fixedNumber.toFormat`,`other`,t)}#i(e,t){return e=A(e,this.#e,t),new o(D,e,this.#e)}#a(e,t){return this.#r(e),this.#i(this.#t+e.#t,t)}addUnsafe(e){return this.#a(e)}add(e){return this.#a(e,`add`)}#o(e,t){return this.#r(e),this.#i(this.#t-e.#t,t)}subUnsafe(e){return this.#o(e)}sub(e){return this.#o(e,`sub`)}#s(e,t){return this.#r(e),this.#i(this.#t*e.#t/this.#n,t)}mulUnsafe(e){return this.#s(e)}mul(e){return this.#s(e,`mul`)}mulSignal(e){this.#r(e);let t=this.#t*e.#t;return f(t%this.#n===T,`precision lost during signalling mul`,`NUMERIC_FAULT`,{operation:`mulSignal`,fault:`underflow`,value:this}),this.#i(t/this.#n,`mulSignal`)}#c(e,t){return f(e.#t!==T,`division by zero`,`NUMERIC_FAULT`,{operation:`div`,fault:`divide-by-zero`,value:this}),this.#r(e),this.#i(this.#t*this.#n/e.#t,t)}divUnsafe(e){return this.#c(e)}div(e){return this.#c(e,`div`)}divSignal(e){f(e.#t!==T,`division by zero`,`NUMERIC_FAULT`,{operation:`div`,fault:`divide-by-zero`,value:this}),this.#r(e);let t=this.#t*this.#n;return f(t%e.#t===T,`precision lost during signalling div`,`NUMERIC_FAULT`,{operation:`divSignal`,fault:`underflow`,value:this}),this.#i(t/e.#t,`divSignal`)}cmp(e){let t=this.value,n=e.value,r=this.decimals-e.decimals;return r>0?n*=k(r):r<0&&(t*=k(-r)),t<n?-1:+(t>n)}eq(e){return this.cmp(e)===0}lt(e){return this.cmp(e)<0}lte(e){return this.cmp(e)<=0}gt(e){return this.cmp(e)>0}gte(e){return this.cmp(e)>=0}floor(){let e=this.#t;return this.#t<T&&(e-=this.#n-E),e=this.#t/this.#n*this.#n,this.#i(e,`floor`)}ceiling(){let e=this.#t;return this.#t>T&&(e+=this.#n-E),e=this.#t/this.#n*this.#n,this.#i(e,`ceiling`)}round(e){if(e??=0,e>=this.decimals)return this;let t=this.decimals-e,n=te*k(t-1),r=this.value+n,i=k(t);return r=r/i*i,A(r,this.#e,`round`),new o(D,r,this.#e)}isZero(){return this.#t===T}isNegative(){return this.#t<T}toString(){return this._value}toUnsafeFloat(){return parseFloat(this.toString())}toFormat(e){return o.fromString(this.toString(),e)}static fromValue(e,n,r){let a=n==null?0:t(n),s=j(r),c=i(e,`value`),l=a-s.decimals;if(l>0){let t=k(l);f(c%t===T,`value loses precision for format`,`NUMERIC_FAULT`,{operation:`fromValue`,fault:`underflow`,value:e}),c/=t}else l<0&&(c*=k(-l));return A(c,s,`fromValue`),new o(D,c,s)}static fromString(t,n){let r=t.match(/^(-?)([0-9]*)\.?([0-9]*)$/);e(r&&r[2].length+r[3].length>0,`invalid FixedNumber string value`,`value`,t);let i=j(n),a=r[2]||`0`,s=r[3]||``;for(;s.length<i.decimals;)s+=O;f(s.substring(i.decimals).match(/^0*$/),`too many decimals for format`,`NUMERIC_FAULT`,{operation:`fromString`,fault:`underflow`,value:t}),s=s.substring(0,i.decimals);let c=BigInt(r[1]+a+s);return A(c,i,`fromString`),new o(D,c,i)}static fromBytes(e,t){let r=a(n(e,`value`)),i=j(t);return i.signed&&(r=C(r,i.width)),A(r,i,`fromBytes`),new o(D,r,i)}},ie=[`wei`,`kwei`,`mwei`,`gwei`,`szabo`,`finney`,`ether`];function M(n,r){let i=18;if(typeof r==`string`){let t=ie.indexOf(r);e(t>=0,`invalid unit`,`unit`,r),i=3*t}else r!=null&&(i=t(r,`unit`));return re.fromValue(n,i,{decimals:i,width:512}).toString()}var N=`./deployments/bsc-mainnet.json`;async function P(e){let t=await fetch(N,{cache:`no-store`});if(!t.ok)throw Error(`无法读取 BSC 部署配置`);let n=await t.json(),r=new URLSearchParams(window.location.search).get(`factory`)||n.factoryAddress;if(n.targets?.length===6)return{...n,factoryAddress:r,targets:n.targets.map(s)};if(r&&x(r)&&e){let t=await new m(s(r),v.abi,e).getTargets();return{...n,factoryAddress:s(r),targets:t.map(s)}}return{...n,factoryAddress:r,targets:[]}}var F=[`function balanceOf(address owner) view returns (uint256)`,`function allowance(address owner, address spender) view returns (uint256)`,`function approve(address spender, uint256 amount) returns (bool)`],ae=document.querySelector(`#app`),I=ee(window.location),L=g(window),R=new u(c.rpcUrls[0],c.chainId),z={providerLabel:L.label,injectedProvider:L.provider,browserProvider:null,signer:null,account:``,chainId:``,lastRequest:`尚未请求`,lastError:``,deployment:null,balance:null,allowances:[,,,,,,].fill(null),cardStatuses:[,,,,,,].fill(`等待连接钱包`),busyCards:new Set,busy:!1};function B(e){return!e||!x(e)?`尚未部署`:`${e.slice(0,8)}...${e.slice(-6)}`}function V(e){if(e==null||!z.deployment)return`--`;let t=z.deployment.token.decimals;return`${M(e,t)} ${z.deployment.token.symbol}`}function H(e){z.lastRequest=e,q()}function U(e){z.lastError=e?b(e):``,q()}function W(){ae.innerHTML=`
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Ave Authorization Matrix</p>
          <h1>六等级授权验收 DApp</h1>
          <p class="muted">当前页面用于触发不同授权合约等级，请仅用于测试验收。</p>
        </div>
        <span class="status-chip" data-tone="${I.tone}">${I.label}</span>
      </header>

      <section class="panel hero">
        <h2>当前 DApp 场景</h2>
        <div class="wallet-grid">
          <div class="metric">
            <span class="metric-label">等级来源</span>
            <span class="metric-value">${I.label}</span>
          </div>
          <div class="metric">
            <span class="metric-label">预期说明</span>
            <span class="metric-value">${I.description}</span>
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
  `,document.querySelector(`#connect-button`).addEventListener(`click`,se),document.querySelector(`#switch-button`).addEventListener(`click`,le),document.querySelector(`#refresh-button`).addEventListener(`click`,X),document.querySelector(`#revoke-button`).addEventListener(`click`,de),document.querySelector(`#copy-config-button`).addEventListener(`click`,fe),G(),q(),K(),Y()}function G(){let e=document.querySelector(`#target-cards`);e&&(e.innerHTML=y.map((e,t)=>{let n=z.deployment?.targets?.[t],r=z.busyCards.has(t),i=!!(z.signer&&n&&!r);return`
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
          <span class="metric-value">${V(z.allowances[t])}</span>
        </div>
        <div class="actions">
          <button class="primary authorize-button" data-index="${t}" ${i?``:`disabled`}>
            ${r?`等待钱包处理...`:`授权给合约 ${t+1}`}
          </button>
          <button class="ghost revoke-one-button" data-index="${t}" ${i?``:`disabled`}>
            撤销
          </button>
        </div>
        <p class="card-status">${z.cardStatuses[t]}</p>
      </article>
    `}).join(``),e.querySelectorAll(`[data-copy-address]`).forEach(e=>{e.addEventListener(`click`,()=>$(e.dataset.copyAddress,e))}),e.querySelectorAll(`.authorize-button`).forEach(e=>{e.addEventListener(`click`,()=>ue(Number(e.dataset.index)))}),e.querySelectorAll(`.revoke-one-button`).forEach(e=>{e.addEventListener(`click`,()=>Z(Number(e.dataset.index)))}))}function K(){let e=document.querySelector(`#wallet-address`);e&&(e.textContent=z.account||`未连接`,document.querySelector(`#chain-id`).textContent=z.chainId?`${Number(z.chainId)===56?`BSC 主网`:`非 BSC 主网`} (${z.chainId})`:`未连接`,document.querySelector(`#token-balance`).textContent=V(z.balance),document.querySelector(`#factory-address`).textContent=z.deployment?.factoryAddress||`尚未配置`,document.querySelector(`#token-address`).textContent=z.deployment?.token?.address||`读取失败`,document.querySelector(`#connect-button`).textContent=z.account?`已连接 Ave 钱包`:`连接 Ave 钱包`,document.querySelector(`#revoke-button`).disabled=!z.signer||z.busy,document.querySelector(`#refresh-button`).disabled=!z.account||z.busy)}function q(){let e=document.querySelector(`#provider-found`);if(!e)return;e.textContent=z.injectedProvider?`已检测到：${z.providerLabel}`:`未检测到`,document.querySelector(`#provider-type`).textContent=o(window.ethereum??window.web3?.currentProvider),document.querySelector(`#last-request`).textContent=z.lastRequest,document.querySelector(`#last-error`).textContent=z.lastError||`无`;let t=document.querySelector(`#global-error`);t.hidden=!z.lastError,t.textContent=z.lastError}function J(){return{chain:`BSC Mainnet`,chainId:56,token:z.deployment?.token??null,factoryAddress:z.deployment?.factoryAddress??``,dapps:h(z.deployment?.factoryAddress??``).map(e=>({source:e.label,url:e.url})),singleHostFallbackDapps:_(new URL(`./`,window.location.href),z.deployment?.factoryAddress??``).map(e=>({source:e.label,url:e.url})),authorizationContracts:y.map((e,t)=>({source:e.label,address:z.deployment?.targets?.[t]??``}))}}function Y(){let e=document.querySelector(`#config-output`);e&&(e.value=JSON.stringify(J(),null,2))}async function oe(){try{z.deployment=await P(R),z.cardStatuses=z.deployment.targets.length===6?[,,,,,,].fill(`已加载授权合约，连接钱包后可测试`):[,,,,,,].fill(`请先打开部署页部署 Factory，再使用生成的测试 URL`),K(),G(),Y()}catch(e){U(e)}}async function se(){if(!z.injectedProvider){U(Error(`未检测到 Ave 或其他 EVM 钱包注入 Provider，请在 Ave DApp 浏览器中打开本页。`));return}try{U(null),H(`eth_requestAccounts`),z.account=s((await z.injectedProvider.request({method:`eth_requestAccounts`}))[0]),z.chainId=await p(z.injectedProvider,H),z.browserProvider=new l(z.injectedProvider,`any`),z.signer=await z.browserProvider.getSigner(z.account),z.deployment=await P(z.browserProvider),ce(),await X()}catch(e){U(e)}finally{K(),G(),Y()}}function ce(){typeof z.injectedProvider?.on!=`function`||z.eventsRegistered||(z.eventsRegistered=!0,z.injectedProvider.on(`accountsChanged`,e=>{z.account=e?.[0]?s(e[0]):``,z.signer=null,z.balance=null,z.allowances=[,,,,,,].fill(null),K(),G()}),z.injectedProvider.on(`chainChanged`,e=>{z.chainId=e,K()}))}async function le(){if(!z.injectedProvider){U(Error(`未检测到钱包 Provider`));return}try{U(null),z.chainId=await p(z.injectedProvider,H),K()}catch(e){U(e)}}async function X(){if(!(!z.account||!z.deployment?.targets?.length))try{z.busy=!0,U(null);let e=new m(z.deployment.token.address,F,R),[t,...n]=await Promise.all([e.balanceOf(z.account),...z.deployment.targets.map(t=>e.allowance(z.account,t))]);z.balance=t,z.allowances=n,z.cardStatuses=z.cardStatuses.map(()=>`额度已刷新`)}catch(e){U(e)}finally{z.busy=!1,K(),G()}}async function ue(e){return Q(e,BigInt(z.deployment.token.approvalRawAmount),`授权`)}async function Z(e){return Q(e,0n,`撤销`)}async function Q(e,t,n){if(!(!z.signer||!z.deployment?.targets?.[e])){z.busyCards.add(e),z.cardStatuses[e]=`正在请求 Ave 钱包${n}...`,U(null),G();try{let r=new m(z.deployment.token.address,F,z.signer);H(`USDC.approve(${B(z.deployment.targets[e])}, ${t})`);let i=await r.approve(z.deployment.targets[e],t);z.cardStatuses[e]=`${n}交易已发送：${i.hash}`,G(),await i.wait(),z.cardStatuses[e]=`${n}成功：${i.hash}`,await X()}catch(t){z.cardStatuses[e]=`${n}未完成：${b(t)}`,U(t)}finally{z.busyCards.delete(e),G()}}}async function de(){if(!(!z.signer||!z.deployment?.targets?.length)){z.busy=!0,K(),U(null);for(let e=0;e<z.deployment.targets.length;e+=1){if(z.allowances[e]===0n){z.cardStatuses[e]=`无需撤销，当前额度为 0`;continue}await Z(e)}z.busy=!1,K()}}async function $(e,t){if(!e)return;await navigator.clipboard.writeText(e);let n=t?.textContent;t&&(t.textContent=`已复制`,window.setTimeout(()=>{t.textContent=n},1200))}async function fe(){let e=document.querySelector(`#copy-config-button`);await $(JSON.stringify(J(),null,2),e)}W(),oe();