(()=>{var e={root:document.getElementById("root"),adminOpen:!1,openLetter:null,openPlaceId:null,gallerySearch:"",ytPlayer:null,ytState:-1,ytVol:100,autoPlayNext:!1,selectedPhotos:[],isSelectMode:!1,worldGeoJSON:null,isIOS:/iPad|iPhone|iPod/.test(navigator.userAgent),devMode:localStorage.getItem("devMode")==="true",logs:[]};var I=null;function T(){return I||(I=new Promise((o,a)=>{if(window.echarts)return o();if(document.querySelector('script[src*="echarts.min.js"]')){let i=()=>{window.echarts?o():setTimeout(i,100)};i();return}let l=document.createElement("script");l.src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js",l.onload=o,l.onerror=a,document.head.appendChild(l)}),I)}var B=null;function M(){return B||(B=new Promise(o=>{if(window.YT&&window.YT.Player)return o();let a=document.querySelector('script[src*="youtube.com/iframe_api"]'),t=()=>{window.YT&&window.YT.Player?o():setTimeout(t,100)};if(a)t();else{window.onYouTubeIframeAPIReady=()=>o();let l=document.createElement("script");l.src="https://www.youtube.com/iframe_api",document.head.appendChild(l)}}),B)}function j(){try{["map","miniMap"].forEach(o=>{let a=document.getElementById(o);if(a&&window.echarts){let t=echarts.getInstanceByDom(a);t&&t.dispose()}})}catch{}}var L=null;function q(){return e.worldGeoJSON?Promise.resolve():L||(L=(async()=>{try{let o=await fetch("https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json");e.worldGeoJSON=await o.json(),window.echarts&&echarts.registerMap("world",e.worldGeoJSON)}catch(o){console.error("Failed to load world map",o)}})(),L)}var W={heart:'<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',photo:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 17-5-5-9 9"/>',letter:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',map:'<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16M15 5v16"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',plus:'<path d="M12 5v14M5 12h14"/>',trash:'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',upload:'<path d="M12 21V9m-4 4 4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',play:'<path d="m5 3 14 9-14 9V3z"/>',pause:'<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',skipBack:'<path d="M19 20 9 12l10-8v16zM5 19V5"/>',skipForward:'<path d="m5 4 10 8-10 8V4zM19 5v14"/>',edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>'},m=o=>`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${W[o]}</svg>`;function d(o){return String(o??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function w(o){return o?new Date(o+(o.length===10?"T00:00:00":"")).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):""}function E(o){return o?new Date(o+(o.length===10?"T00:00:00":"")).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}):""}function h(o,{isConfirm:a=!1,isDanger:t=!1}={}){return document.activeElement&&document.activeElement.blur&&document.activeElement.blur(),new Promise(l=>{let i=document.createElement("div");i.className="scrim",i.style.zIndex="9999",i.innerHTML=`
      <div class="dialog" style="max-width:380px;text-align:center;padding:34px 24px;">
        <div class="leaf-decor" style="font-size:32px;margin-bottom:12px;opacity:0.8;">\u2766</div>
        <div class="dsub" style="font-size:17px;color:var(--ink);margin-bottom:28px;">${d(o)}</div>
        <div class="dialog-actions" style="justify-content:center;gap:12px">
          ${a?'<button class="btn ghost" data-c>Cancel</button>':""}
          <button class="btn" data-o style="${t?"background:#a86060;border-color:#a86060":""}">${a?t?"Delete":"Yes":"OK"}</button>
        </div>
      </div>
    `,document.body.appendChild(i);let s=p=>{i.remove(),l(p)},r=null;a&&(r=i.querySelector("[data-c]"),r.onclick=()=>s(!1));let n=i.querySelector("[data-o]");n.onclick=()=>s(!0),r||(r=n),setTimeout(()=>r.focus(),10)})}function z(o){let a=new Date(o+"T00:00:00"),t=new Date,l=t.getFullYear()-a.getFullYear(),i=t.getMonth()-a.getMonth(),s=t.getDate()-a.getDate();if(s<0){i--;let c=new Date(t.getFullYear(),t.getMonth(),0);s+=c.getDate()}i<0&&(l--,i+=12);let r=Math.floor((t-a)/(1e3*60*60*24)),n=new Date(t.getFullYear(),a.getMonth(),a.getDate());n<t&&n.setFullYear(t.getFullYear()+1);let p=Math.ceil((n-t)/(1e3*60*60*24));return{years:l,months:i,days:s,totalDays:r,daysUntilAnniv:p}}function C(o){let a="",t=0;try{let l=new URL(o);l.hostname==="youtu.be"?(a=l.pathname.slice(1),t=parseInt(l.searchParams.get("t"))||0):(a=l.searchParams.get("v"),t=parseInt(l.searchParams.get("t"))||0)}catch{let i=o.match(/v=([^&]+)/)||o.match(/embed\/([^?]+)/);i&&(a=i[1])}return{id:a,start:t}}function P(o){return new Promise((a,t)=>{let l=/iPad|iPhone|iPod/.test(navigator.userAgent),i=l?1e3:1200,s=l?300*1024:500*1024,r=new Image,n=URL.createObjectURL(o);r.onload=()=>{URL.revokeObjectURL(n);let{width:p,height:c}=r;if(p>i||c>i){let N=Math.min(i/p,i/c);p=Math.round(p*N),c=Math.round(c*N)}let u=document.createElement("canvas");u.width=p,u.height=c;let y=u.getContext("2d");y.imageSmoothingEnabled=!0,y.imageSmoothingQuality="high",y.drawImage(r,0,0,p,c);let g=.9,$=u.toDataURL("image/jpeg",g);for(;$.length>s&&g>.3;)g-=.05,$=u.toDataURL("image/jpeg",g);a($)},r.onerror=()=>{if(URL.revokeObjectURL(n),o.size>1024*1024){t(new Error("Image format not supported for compression and file is too large."));return}let p=new FileReader;p.onload=()=>a(p.result),p.onerror=()=>t(p.error),p.readAsDataURL(o)},r.src=n})}function X(){let o=document.createElement("div");o.className="scrim",o.style.zIndex="3000",o.innerHTML=`
    <div class="dialog" style="max-width:800px; height:80vh; display:flex; flex-direction:column; padding:24px">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
        <h2 style="margin:0">System Logs</h2>
        <button class="btn soft" onclick="this.closest('.scrim').remove()">Close</button>
      </div>
      <div id="log-list" style="flex:1; overflow-y:auto; background:#121212; color:#e0e0e0; padding:20px; font-family:monospace; font-size:12px; border-radius:16px; white-space:pre-wrap; border: 1px solid #333;">
        Loading logs from cloud...
      </div>
      <div style="margin-top:16px; font-size:12px; color:var(--ink-soft)">
        * showing last 100 events from all devices
      </div>
    </div>
  `,document.body.appendChild(o),Store.getLogs(100).then(a=>{let t=document.getElementById("log-list");if(!a||a.length===0){t.innerHTML="No logs found in cloud.";return}t.innerHTML=a.map(l=>{let i=new Date(l.ts).toLocaleString();return`<div style="margin-bottom:12px; border-bottom:1px solid #222; padding-bottom:8px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px">
            <span style="color:${l.type==="error"||l.type==="promise_error"?"#ff6b6b":l.type==="debug"?"#4dabf7":"#a9e34b"}; font-weight:bold;">[${l.type.toUpperCase()}]</span>
            <span style="color:#666; font-size:11px;">${i}</span>
          </div>
          <div style="color:#fff; margin-bottom:4px">${d(l.msg)}</div>
          ${l.placeId?`<div style="color:#ffd43b">Place ID: ${l.placeId}</div>`:""}
          ${l.photoId?`<div style="color:#ffd43b">Photo ID: ${l.photoId}</div>`:""}
          ${l.stack?`<div style="color:#888; font-size:11px; background:#1a1a1a; padding:8px; border-radius:6px; margin:6px 0; overflow-x:auto;">${d(l.stack)}</div>`:""}
          <div style="color:#555; font-size:10px; margin-top:4px;">Device: ${d(l.ua)}</div>
        </div>`}).join("")}).catch(a=>{let t=document.getElementById("log-list");t&&(t.innerHTML="Failed to load logs: "+d(a.message))})}function f(){if(document.querySelectorAll(".drawer-scrim, .drawer").forEach(r=>r.remove()),!e.adminOpen)return;let o=Store.get(),a=document.createElement("div");a.className="drawer-scrim",a.style.cssText="position:fixed;inset:0;background:rgba(40,46,30,.35);backdrop-filter:blur(4px);z-index:89",document.body.appendChild(a);let t=document.createElement("div");t.className="drawer open",t.innerHTML=`
    <button class="closeX" data-close>\xD7</button>
    <h2>Garden settings</h2>
    <div class="ds">tend to the details of our little place</div>

    <div class="drawer-section">
      <h3>About us</h3>
      <div class="field"><label>Your name</label><input id="aname1" value="${d(o.couple.name1)}"></div>
      <div class="field"><label>Their name</label><input id="aname2" value="${d(o.couple.name2)}"></div>
      <div class="field"><label>Motto / subtitle</label><input id="amotto" value="${d(o.couple.motto)}"></div>
      <div class="field"><label>Anniversary (this is also your password)</label><input type="date" id="aanniv" value="${d(o.couple.anniversary)}"></div>
      <button class="btn" id="saveCouple">Save</button>
    </div>

    ${e.devMode?`
    <div class="drawer-section" style="background:${Store.cloud.connected?"#eaf0e0":"#faf6ed"}">
      <h3>\u2601 Cloud Sync (Firebase) ${Store.cloud.connected?'<span style="font-size:12px;color:var(--sage);font-style:italic;font-weight:400">\xB7 connected</span>':""}</h3>
      <p style="font-family:var(--serif);font-style:italic;color:var(--ink-soft);font-size:14px;margin-bottom:12px;line-height:1.5">
        ${Store.cloud.connected?"data syncs automatically across all devices. both of you see updates in realtime.":"free \xB7 syncs data between you & your partner automatically. see setup guide in FIREBASE_SETUP.md"}
      </p>
      ${Store.cloud.connected?`
        <div class="drawer-actions">
          <button class="btn soft" id="pushCloudBtn">${m("upload")} Push local to cloud</button>
          <button class="btn soft" id="disconnectCloudBtn" style="color:#a86060">Disconnect</button>
        </div>
      `:`
        <button class="btn" id="connectCloudBtn">Connect to Firebase</button>
      `}
    </div>
    `:""}

    <div class="drawer-section">
      <h3>Back up &amp; restore</h3>
      <div class="drawer-actions" style="display:flex; flex-wrap:wrap; gap:8px;">
        <button class="btn soft" id="exportBtn" style="flex:1; min-width:80px; justify-content:center; display:flex; align-items:center; gap:6px; font-size:14px;">${m("download")} Export</button>
        <button class="btn soft" id="logsBtn" style="flex:1; min-width:80px; justify-content:center; display:flex; align-items:center; gap:6px; font-size:14px;">${m("settings")} Logs</button>
        <label class="btn soft" style="flex:1; min-width:80px; cursor:pointer; justify-content:center; display:flex; align-items:center; gap:6px; font-size:14px;">
          ${m("upload")} Import<input type="file" id="importBtn" accept="application/json" style="display:none">
        </label>
      </div>
    </div>

    <div class="drawer-section" style="background:${e.devMode?"#e0f0f0":"#faf6ed"}">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
        <h3 style="margin:0">Dev Mode</h3>
        <label class="switch">
          <input type="checkbox" id="devToggle" ${e.devMode?"checked":""}>
          <span class="slider"></span>
        </label>
      </div>
      <div class="ds" style="margin-bottom:0">enable debug logs on screen</div>
    </div>

    <div class="drawer-section" style="background:#f6ecea;border-color:#e4cfcb">
      <h3 style="color:#a86060">Danger</h3>
      <button class="btn soft" id="resetBtn" style="color:#a86060;border-color:#d9b4ae">Reset everything</button>
    </div>
  `,document.body.appendChild(t),t.querySelector("#devToggle").onchange=r=>{e.devMode=r.target.checked,localStorage.setItem("devMode",e.devMode),A(),f()},a.onclick=()=>{e.adminOpen=!1,f()},t.querySelector("[data-close]").onclick=()=>{e.adminOpen=!1,f()},t.querySelector("#saveCouple").onclick=()=>{Store.setCouple({name1:document.getElementById("aname1").value.trim(),name2:document.getElementById("aname2").value.trim(),motto:document.getElementById("amotto").value.trim()||"our little garden",anniversary:document.getElementById("aanniv").value}),e.adminOpen=!1,f(),v()},t.querySelector("#exportBtn").onclick=()=>Store.exportJSON(),t.querySelector("#logsBtn").onclick=()=>{e.adminOpen=!1,f(),X()};let l=t.querySelector("#connectCloudBtn");l&&(l.onclick=()=>Z());let i=t.querySelector("#pushCloudBtn");i&&(i.onclick=()=>Store.pushLocalToCloud());let s=t.querySelector("#disconnectCloudBtn");s&&(s.onclick=async()=>{await h("Disconnect cloud sync? Local data stays.",{isConfirm:!0})&&(await Store.disconnectCloud(),e.adminOpen=!1,f(),setTimeout(()=>{e.adminOpen=!0,f()},50))}),t.querySelector("#importBtn").onchange=async r=>{let n=r.target.files[0];if(n)try{await Store.importJSON(n),alert("imported \u2661"),e.adminOpen=!1,f(),v()}catch(p){alert("import failed: "+p.message)}},t.querySelector("#resetBtn").onclick=async()=>{await h("Really clear everything? This cannot be undone.",{isConfirm:!0,isDanger:!0})&&(Store.resetAll(),e.adminOpen=!1,f(),location.hash="#/home",v())}}function Z(){let o=Store.cloud.config||{},a=document.createElement("div");a.className="scrim",a.innerHTML=`
    <div class="dialog" style="max-width:560px">
      <h2>Connect to Firebase</h2>
      <div class="dsub">paste your firebaseConfig from the Firebase console</div>
      <div class="field">
        <label>firebaseConfig (paste the whole object)</label>
        <textarea id="fbcfg" style="font-family:monospace;font-size:13px;min-height:180px" placeholder='{ "apiKey": "...", "projectId": "...", ... }'>${o.apiKey?JSON.stringify(o,null,2):""}</textarea>
      </div>
      <div class="dialog-actions">
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-connect>Connect</button>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector("[data-cancel]").onclick=()=>a.remove(),a.querySelector("[data-connect]").onclick=async()=>{let t=document.getElementById("fbcfg").value.trim(),l;try{l=JSON.parse(t)}catch{try{let s=t.replace(/^\s*(const|let|var)\s+\w+\s*=\s*/,"").replace(/;?\s*$/,"");l=Function('"use strict";return('+s+")")()}catch{alert("invalid config format");return}}if(!l.apiKey||!l.projectId){alert("missing apiKey or projectId");return}await Store.connectCloud(l)&&(a.remove(),e.adminOpen=!1,f(),setTimeout(()=>{e.adminOpen=!0,f()},50),alert("Connected to cloud \u2661"))}}function A(){let o=document.getElementById("debug-panel");if(!e.devMode){o&&o.remove();return}o||(o=document.createElement("div"),o.id="debug-panel",o.style.cssText=`
      position:fixed; bottom:20px; right:20px; width:300px; height:200px;
      background:rgba(0,0,0,0.8); color:#0f0; font-family:monospace; font-size:10px;
      padding:10px; border-radius:10px; z-index:9999; overflow-y:auto;
      pointer-events:none; border:1px solid #0f0; box-shadow: 0 0 20px rgba(0,255,0,0.2);
    `,document.body.appendChild(o),window.addEventListener("sage-log",a=>{let t=a.detail,l=document.createElement("div");l.style.marginBottom="4px",l.textContent=`[${t.type}] ${t.msg}`,o.appendChild(l),o.scrollTop=o.scrollHeight})),o.innerHTML=e.logs.slice(0,50).reverse().map(a=>`<div>[${a.type}] ${a.msg}</div>`).join(""),o.scrollTop=o.scrollHeight}function b(){let o=document.getElementById("adminBtn");o&&(o.onclick=()=>{e.adminOpen=!e.adminOpen,f()});let a=document.getElementById("lockBtn");a&&(a.onclick=()=>{Store.lock(),v()})}function S(){let o=Store.get();return`
  <div class="topbar">
    <div class="brand">${d(o.couple.name1||"you")} <span class="brand-dot"></span> <em>${d(o.couple.name2||"me")}</em></div>
    <div class="topbar-right">
      <button class="icon-btn" id="adminBtn" title="Manage content">${m("settings")}</button>
      <button class="icon-btn" id="lockBtn" title="Lock">${m("lock")}</button>
    </div>
  </div>`}function x(o){return`<nav class="menu-nav">${[["home","Home"],["gallery","Gallery"],["letters","Love Notes"],["map","Our Map"],["playlist","Our Playlist"]].map(([t,l])=>`<a href="#/${t}" class="${o===t?"active":""}">${l}</a>`).join("")}</nav>`}function U(){e.root.innerHTML=`
  <div class="login-wrap">
    <div class="login-card">
      <div class="leaf-decor">\u2766</div>
      <h1>Our <em>little</em> garden</h1>
      <div class="sub">\u2014 a private place, just for us \u2014</div>
      <form id="loginForm">
        <input type="password" class="pwd-input" id="pwd" placeholder="\u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022" autocomplete="off" autofocus>
        <div class="err" id="err"></div>
        <div class="pwd-hint">the day we began (ddmmyyyy)</div>
        <button type="submit" class="btn" style="margin-top:26px;width:100%;justify-content:center">Enter</button>
      </form>
      <div class="login-foot">EST. ${w(Store.get().couple.anniversary).toUpperCase()}</div>
    </div>
  </div>`,document.getElementById("loginForm").addEventListener("submit",o=>{o.preventDefault();let a=document.getElementById("pwd").value.replace(/\D/g,""),t=Store.get().couple.anniversary,[l,i,s]=t.split("-"),r=`${s}${i}${l}`,n=`${l}${i}${s}`,p=`${s}${i}${l.slice(2)}`;a===r||a===n||a===p?(Store.unlock(),location.hash="#/home",v()):(document.getElementById("err").textContent="not quite \u2014 try the date we began",document.getElementById("pwd").value="")})}function H(){let o=Store.get(),a=z(o.couple.anniversary);e.root.innerHTML=`
    ${S()}
    <div class="page">
      ${x("home")}
      <div class="home-hero">
        <div class="home-motto">${d(o.couple.motto)}</div>
        <h1 class="home-title">${d(o.couple.name1||"us")} <em>&amp;</em> ${d(o.couple.name2||"us")}</h1>
      </div>
      <div class="counter-row">
        <div class="c-cell"><div class="c-num">${a.years}</div><div class="c-lbl">year${a.years===1?"":"s"}</div><div class="c-corner"></div></div>
        <div class="c-cell"><div class="c-num">${a.months}</div><div class="c-lbl">month${a.months===1?"":"s"}</div><div class="c-corner"></div></div>
        <div class="c-cell"><div class="c-num">${a.days}</div><div class="c-lbl">day${a.days===1?"":"s"}</div><div class="c-corner"></div></div>
      </div>
      <div class="total-row">
        <div class="total-cell"><span class="k">Since we began</span><span class="v">${a.totalDays.toLocaleString()} days</span></div>
        <div class="total-cell"><span class="k">Next anniversary in</span><span class="v">${a.daysUntilAnniv} days</span></div>
      </div>
      <div class="quick-grid">
        ${o.songs.length>0?(()=>{let i=o.songs[Math.floor(Math.random()*o.songs.length)];return`
          <div class="home-playlist-card" id="homeSongCard" data-yt="${d(i.ytUrl||"")}">
            <div class="hp-vinyl" id="homeVinyl"><img src="${d(i.cover)}" class="hp-cover"></div>
            <div class="hp-info">
              <div class="label">Our song of the day</div>
              <div class="title">${d(i.title)}</div>
              <div class="artist">${d(i.artist)}</div>
            </div>
            <div class="hp-play-btn" style="font-size:24px; cursor:pointer; z-index:2" id="homePlayIcon">${m("play")}</div>
            <div id="home-yt-frame" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none"></div>
          </div>`})():""}
        <a href="#/gallery" class="q-card">
          <div class="qico">${m("photo")}</div>
          <h3>Our Gallery</h3>
          <div class="qc"><span>${o.photos.length} photos</span><span class="qarr">\u2192</span></div>
        </a>
        <a href="#/letters" class="q-card">
          <div class="qico">${m("letter")}</div>
          <h3>Love Notes</h3>
          <div class="qc"><span>${o.letters.length} letters</span><span class="qarr">\u2192</span></div>
        </a>
        <a href="#/map" class="q-card">
          <div class="qico">${m("map")}</div>
          <h3>Our Map</h3>
          <div class="qc"><span>${o.places.length} places</span><span class="qarr">\u2192</span></div>
        </a>
      </div>
    </div>
  `,b();let t=document.getElementById("homeSongCard"),l=document.getElementById("homePlayIcon");if(t&&l){let i=t.dataset.yt;if(i){let s=async()=>{if(e.ytPlayer||(l&&(l.style.opacity="0.5",l.style.cursor="wait"),await M(),!window.YT||!window.YT.Player))return;let r=C(i);r.id&&(e.ytPlayer=new YT.Player("home-yt-frame",{height:"1px",width:"1px",videoId:r.id,host:"https://www.youtube.com",playerVars:{start:r.start,autoplay:1,origin:window.location.origin},events:{onReady:n=>{l&&(l.style.opacity="1",l.style.cursor="pointer"),n.target.setVolume(e.ytVol),n.target.playVideo()},onStateChange:n=>{let p=n.data,c=document.getElementById("homeVinyl");l&&(l.innerHTML=m(p===1?"pause":"play")),c&&c.classList.toggle("playing",p===1)}}}))};l.onclick=r=>{if(r.stopPropagation(),!e.ytPlayer){s();return}e.ytPlayer.getPlayerState&&e.ytPlayer.getPlayerState()===1?e.ytPlayer.pauseVideo():e.ytPlayer.playVideo&&e.ytPlayer.playVideo()},t.onclick=r=>{r.target.closest("#homePlayIcon")||(location.hash="#/playlist")}}else t.onclick=()=>location.hash="#/playlist"}else t&&(t.onclick=()=>location.hash="#/playlist")}function k(){let o=Store.get(),a=e.gallerySearch.toLowerCase(),t=o.photos.filter(n=>!n.placeId&&(!a||(n.caption||"").toLowerCase().includes(a)||(n.date||"").includes(a)));e.root.innerHTML=`
    ${S()}
    <div class="page">
      ${x("gallery")}
      <div class="page-header" style="text-align:center">
        <div class="eyebrow">Our Gallery</div>
        <h1 class="page-title">Moments, <em>remembered</em></h1>
        <div class="page-sub">every quiet thing, kept</div>
      </div>
      <div class="gallery-toolbar">
        <div class="search-box">${m("search")}<input type="text" placeholder="search..." id="gsearch" value="${d(e.gallerySearch)}"></div>
        <div style="display:flex;gap:8px">
          ${e.isSelectMode?`<button class="btn soft" id="cancelSelect">Cancel</button><button class="btn" id="bulkDeleteBtn" style="background:#a86060;border-color:#a86060">${m("trash")} Delete (${e.selectedPhotos.length})</button>`:`<button class="btn soft" id="startSelect">${m("heart")} Select</button><button class="btn" id="addPhotoBtn">${m("plus")} Add photo</button>`}
        </div>
      </div>
      ${t.length===0?`<div class="empty"><span class="leaf">\u2766</span>${e.gallerySearch?"no moments match that":"no photos yet"}</div>`:`
        <div class="masonry ${e.isSelectMode?"select-mode":""}">
          ${t.map(n=>{let p=e.selectedPhotos.includes(n.id);return`
              <div class="m-item ${p?"selected":""}" data-photo="${d(n.id)}">
                ${n.url?`<img src="${d(n.url)}" alt="${d(n.caption||"")}" loading="lazy">`:'<div class="m-ph">photo placeholder</div>'}
                <div class="m-sel-check">${p?"\u2713":""}</div>
                ${e.isSelectMode?"":`<button class="m-del" data-del="${d(n.id)}" title="Remove">\xD7</button>`}
                ${n.caption||n.date?`<div class="mcap"><span>${d(n.caption||"")}</span><span class="mdate">${d(w(n.date))}</span></div>`:""}
              </div>
            `}).join("")}
        </div>`}
    </div>
  `,b();let l=document.getElementById("addPhotoBtn");l&&(l.onclick=()=>Q());let i=document.getElementById("startSelect");i&&(i.onclick=()=>{e.isSelectMode=!0,e.selectedPhotos=[],k()});let s=document.getElementById("cancelSelect");s&&(s.onclick=()=>{e.isSelectMode=!1,e.selectedPhotos=[],k()});let r=document.getElementById("bulkDeleteBtn");r&&e.selectedPhotos.length>0&&(r.onclick=async()=>{await h(`Delete ${e.selectedPhotos.length} photos?`,{isConfirm:!0,isDanger:!0})&&(e.selectedPhotos.forEach(n=>Store.removePhoto(n)),e.selectedPhotos=[],e.isSelectMode=!1,k())}),document.getElementById("gsearch").oninput=n=>{e.gallerySearch=n.target.value,k()},e.root.querySelectorAll("[data-photo]").forEach(n=>{n.onclick=p=>{if(p.target.matches("[data-del]"))return;let c=n.dataset.photo;if(e.isSelectMode){let u=n.querySelector(".m-sel-check");e.selectedPhotos.includes(c)?(e.selectedPhotos=e.selectedPhotos.filter(g=>g!==c),n.classList.remove("selected"),u&&(u.textContent="")):(e.selectedPhotos.push(c),n.classList.add("selected"),u&&(u.textContent="\u2713"));let y=document.getElementById("bulkDeleteBtn");y&&(y.innerHTML=`${m("trash")} Delete (${e.selectedPhotos.length})`)}else{let u=Store.get().photos.find(y=>y.id===c);u&&D(u)}}}),e.root.querySelectorAll("[data-del]").forEach(n=>{n.onclick=async p=>{p.stopPropagation(),await h("Remove this photo?",{isConfirm:!0,isDanger:!0})&&(Store.removePhoto(n.dataset.del),k())}})}function Q(o){let a=!!o,t=o||{url:"",caption:"",date:new Date().toISOString().slice(0,10)},l=document.createElement("div");l.className="scrim",l.innerHTML=`
    <div class="dialog">
      <h2>${a?"Edit photo":"Add a memory"}</h2>
      <div class="field"><label>Image URL</label><input id="purl" value="${d(t.url)}"></div>
      <div class="field"><label>Or upload</label><input type="file" id="pfile" accept="image/*" multiple></div>
      <div class="field"><label>Caption</label><input id="pcap" value="${d(t.caption)}"></div>
      <div class="field"><label>Date</label><input type="date" id="pdate" value="${d(t.date)}"></div>
      <div class="dialog-actions">
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>Save</button>
      </div>
    </div>
  `,document.body.appendChild(l),document.body.classList.add("no-scroll"),l.querySelector("[data-cancel]").onclick=()=>{document.body.classList.remove("no-scroll"),l.remove()},l.querySelector("[data-save]").onclick=async()=>{let i=document.getElementById("purl").value.trim(),s=document.getElementById("pfile").files,r=document.getElementById("pcap").value.trim(),n=document.getElementById("pdate").value;if(!i&&s.length===0){alert("please add a URL or select files");return}let p=l.querySelector("[data-save]");p.textContent="Saving...",p.disabled=!0;try{if(a){let c=i;s.length>0&&(c=await P(s[0])),Store.updatePhoto(t.id,{url:c,caption:r,date:n})}else{i&&Store.addPhoto({url:i,caption:r,date:n});for(let c=0;c<s.length;c++){let u=await P(s[c]);Store.addPhoto({url:u,caption:r,date:n})}}document.body.classList.remove("no-scroll"),l.remove(),v()}catch(c){alert(c.message),p.textContent="Save",p.disabled=!1}}}function D(o){Store.log("debug","opening lightbox",{photoId:o.id}),document.body.classList.add("no-scroll");let a=document.createElement("div");a.className="lightbox",a.innerHTML=`
    <button class="lclose" aria-label="Close">\xD7</button>
    <button class="ldelete" aria-label="Delete">${m("trash")}</button>
    <img src="${d(o.url)}">
    ${o.caption||o.date?`<div class="lcap">${d(o.caption||"")}${o.caption&&o.date?" \xB7 ":""}${d(E(o.date))}</div>`:""}
  `,document.body.appendChild(a),a.addEventListener("click",t=>{(t.target===a||t.target.classList.contains("lclose"))&&(document.body.classList.remove("no-scroll"),a.remove())}),a.querySelector(".ldelete").onclick=async()=>{await h("Delete this memory?",{isConfirm:!0,isDanger:!0})&&(Store.removePhoto(o.id),document.body.classList.remove("no-scroll"),a.remove(),v())}}function F(){let o=Store.get();e.root.innerHTML=`
    ${S()}
    <div class="page">
      ${x("letters")}
      <div class="page-header" style="text-align:center">
        <div class="eyebrow">Love Notes</div>
        <h1 class="page-title">Letters, <em>for you</em></h1>
        <div class="page-sub">softly folded, kept in the drawer</div>
      </div>
      <div class="letters-grid">
        ${o.letters.map(a=>`
          <div class="envelope ${d(a.color||"peach")}" data-letter="${d(a.id)}">
            <div class="env-flap"></div>
            <div class="env-seal">\u2661</div>
            <div class="env-to">to ${d(a.to||"you")}</div>
            <div class="env-meta">
              <div class="env-date">${d(w(a.date))}</div>
              <div class="env-title">${d(a.title||"a little note")}</div>
            </div>
          </div>
        `).join("")}
        <div class="envelope add" id="addLetterBtn">
          <div style="text-align:center"><span>+</span><div>write a new note</div></div>
        </div>
      </div>
      ${o.letters.length===0?'<div class="empty" style="grid-column:1/-1"><span class="leaf">\u2766</span>no letters yet</div>':""}
    </div>
  `,b(),document.getElementById("addLetterBtn").onclick=()=>V(),e.root.querySelectorAll("[data-letter]").forEach(a=>{a.onclick=()=>{e.openLetter=a.dataset.letter,v()}}),e.openLetter&&ee()}function ee(){let a=Store.get().letters.find(l=>l.id===e.openLetter);if(!a){e.openLetter=null;return}let t=document.createElement("div");t.className="scrim letter-scrim",t.innerHTML=`
    <div class="dialog" role="dialog">
      <div class="letter-head">
        <div class="ld">${d(E(a.date))}</div>
        <div class="ld">${d(a.from||"")}</div>
      </div>
      <div class="letter-to">Dear <em>${d(a.to||"you")}</em>,</div>
      <div class="letter-body">${d(a.body||"")}</div>
      <div class="letter-sign">\u2014 always, ${d(a.from||"yours")}</div>
      <div class="letter-actions">
        <button class="btn ghost" data-edit>Edit</button>
        <button class="btn soft" data-close>Close</button>
      </div>
    </div>
  `,document.body.appendChild(t),t.addEventListener("click",l=>{l.target===t&&(e.openLetter=null,t.remove())}),t.querySelector("[data-close]").onclick=()=>{e.openLetter=null,t.remove()},t.querySelector("[data-edit]").onclick=()=>{t.remove(),V(a)}}function V(o){let a=!!o,t=o||{from:Store.get().couple.name1||"",to:Store.get().couple.name2||"",title:"",body:"",color:"peach",date:new Date().toISOString().slice(0,10)},l=document.createElement("div");l.className="scrim",l.innerHTML=`
    <div class="dialog">
      <h2>${a?"Edit note":"A new note"}</h2>
      <div class="field"><label>Title</label><input id="ltitle" value="${d(t.title)}" placeholder="a little note"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="field"><label>From</label><input id="lfrom" value="${d(t.from)}"></div>
        <div class="field"><label>To</label><input id="lto" value="${d(t.to)}"></div>
      </div>
      <div class="field"><label>Date</label><input type="date" id="ldate" value="${d(t.date)}"></div>
      <div class="field"><label>Letter</label><textarea id="lbody" placeholder="write from the heart...">${d(t.body)}</textarea></div>
      <div class="field"><label>Envelope color</label>
        <div class="color-swatches" id="swatches">
          ${["peach","sage","blush","sand","lavender"].map(s=>`<div class="sw ${s} ${t.color===s?"active":""}" data-color="${s}"></div>`).join("")}
        </div>
      </div>
      <div class="dialog-actions">
        ${a?'<button class="btn soft" data-del style="margin-right:auto;color:#a86060">Delete</button>':""}
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>${a?"Save":"Seal it"}</button>
      </div>
    </div>
  `,document.body.appendChild(l);let i=t.color;l.querySelectorAll(".sw").forEach(s=>s.onclick=()=>{i=s.dataset.color,l.querySelectorAll(".sw").forEach(r=>r.classList.toggle("active",r===s))}),l.querySelector("[data-cancel]").onclick=()=>l.remove(),l.querySelector("[data-save]").onclick=()=>{let s={title:document.getElementById("ltitle").value.trim()||"a little note",from:document.getElementById("lfrom").value.trim(),to:document.getElementById("lto").value.trim(),date:document.getElementById("ldate").value,body:document.getElementById("lbody").value,color:i};a?Store.updateLetter(t.id,s):Store.addLetter(s),l.remove(),e.openLetter=null,v()},a&&(l.querySelector("[data-del]").onclick=async()=>{await h("Delete this note?",{isConfirm:!0,isDanger:!0})&&(Store.removeLetter(t.id),l.remove(),e.openLetter=null,v())})}async function R(){let o=Store.get();if(e.root.innerHTML=`
    ${S()}
    <div class="page">
      ${x("map")}
      <div class="page-header" style="text-align:center">
        <div class="eyebrow">Our Map</div>
        <h1 class="page-title">Places, <em>together</em></h1>
        <div class="page-sub">every pin, a story</div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
        <button class="btn" id="addPlaceBtn">${m("plus")} Add a place</button>
      </div>
      <div class="map-layout">
        <div id="map"></div>
        <div class="places-list">
          ${o.places.length===0?'<div class="empty" style="padding:40px 20px"><span class="leaf">\u2766</span>no places yet</div>':o.places.sort((n,p)=>new Date(p.date)-new Date(n.date)).map(n=>`
            <div class="place-item" data-place="${d(n.id)}">
              <h4>${d(n.name)}</h4>
              <div class="pd">${d(w(n.date))}</div>
              <div class="pcount">${(n.photos||[]).length+o.photos.filter(p=>p.placeId===n.id).length} photos \u2192</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `,b(),document.getElementById("addPlaceBtn").onclick=()=>Y(),await T(),!window.echarts){e.root.querySelector("#map").innerHTML='<div class="empty"><span class="leaf">\u2766</span>Map failed to load.</div>';return}await q(),e.worldGeoJSON&&window.echarts&&echarts.registerMap("world",e.worldGeoJSON);let a=document.getElementById("map");if(!a)return;let t=echarts.init(a),l=[...o.places].sort((n,p)=>new Date(n.date)-new Date(p.date)).filter(n=>typeof n.lng=="number"&&typeof n.lat=="number"),i=l.map(n=>({name:n.name,value:[n.lng,n.lat,n.id],date:n.date})),s=[10.75,59.91],r=l.filter(n=>Math.sqrt(Math.pow(n.lng-s[0],2)+Math.pow(n.lat-s[1],2))>.5).map(n=>({coords:[s,[n.lng,n.lat]]}));t.setOption({backgroundColor:"transparent",tooltip:{trigger:"item",formatter:n=>n.seriesType!=="scatter"?"":`
          <div style="text-align:center; width: 160px;">
            <img src="data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="106"><rect width="160" height="106" fill="%23f2f4ec"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">\u{1F4CD}</text></svg>" style="width: 160px; height: 106px; object-fit: cover; display: block; margin-bottom: 12px; background: #eee; border-radius: 4px;">
            <div style="font-family:serif; font-weight: 600; font-size: 16px; color:#2a3625;">${n.name}</div>
            <div style="font-size: 11px; color:#7a8a60; margin-top: 4px;">${w(n.data.date)}</div>
          </div>`,backgroundColor:"#ffffff",padding:[8,8,16,8]},geo:{map:"world",roam:!0,itemStyle:{areaColor:"#2b3626",borderColor:"#4a5838"}},series:[{type:"scatter",coordinateSystem:"geo",data:i,symbol:"pin",symbolSize:18,symbolOffset:[0,"-50%"],itemStyle:{color:"#e6b99a"}},{type:"lines",coordinateSystem:"geo",data:r,lineStyle:{color:"#ffffff",width:1,opacity:.4,curveness:.3,type:"dashed"}},{type:"scatter",coordinateSystem:"geo",data:[{name:"Home \u{1F3E0}",value:[10.75,59.91]}],symbol:"pin",symbolSize:26,symbolOffset:[0,"-50%"],itemStyle:{color:"#e05a5a"},label:{show:!0,formatter:"\u{1F3E0}",fontSize:10},silent:!0}]}),t.on("click",n=>{if(n.componentType==="series"&&n.seriesType==="scatter"){let p=Store.get().places.find(c=>c.id===n.data.value[2]);p&&(e.openPlaceId=p.id,v())}}),e.root.querySelectorAll(".place-item").forEach(n=>{n.onclick=()=>{e.openPlaceId=n.dataset.place,v()}}),window.addEventListener("resize",()=>t&&t.resize()),e.openPlaceId&&O()}function O(o=0){let a=Store.get(),t=a.places.find(c=>c.id===e.openPlaceId);if(!t){e.openPlaceId=null;return}let l=a.photos.filter(c=>c.placeId===t.id),i=t.photos||[],s=document.createElement("div");s.className="scrim",s.innerHTML=`
    <div class="dialog" style="max-width:680px">
      <div class="dialog-header">
        <div class="header-left">
          <div class="eyebrow">${d(E(t.date))}</div>
          <h2 style="margin:0">${d(t.name)}</h2>
        </div>
        <div style="display:flex;gap:8px">
          ${e.isSelectMode?`
            <button class="btn" id="bulkDeletePlaceBtn" style="background:#a86060">${m("trash")} Delete (${e.selectedPhotos.length})</button>
            <button class="btn soft" id="startPlaceSelect">Cancel</button>
          `:`
            <button class="btn soft" id="startPlaceSelect">${m("heart")} Select</button>
            <button class="icon-btn close-dialog" data-close>\xD7</button>
          `}
        </div>
      </div>
      ${t.note?`<div class="place-note">${d(t.note)}</div>`:""}
      <div class="place-photos ${e.isSelectMode?"select-mode":""}">
        ${i.map((c,u)=>{let y=`legacy-${u}`,g=e.selectedPhotos.includes(y);return`<div class="pp ${g?"selected":""}" data-ppi="${y}"><img src="${d(c)}"><div class="m-sel-check">${g?"\u2713":""}</div>${e.isSelectMode?"":`<button class="m-del" data-legacy-ppdel="${u}">\xD7</button>`}</div>`}).join("")}
        ${l.map(c=>{let u=e.selectedPhotos.includes(c.id);return`<div class="pp ${u?"selected":""}" data-ppid="${d(c.id)}"><img src="${d(c.url)}"><div class="m-sel-check">${u?"\u2713":""}</div>${e.isSelectMode?"":`<button class="m-del" data-ppdel="${d(c.id)}">\xD7</button>`}</div>`}).join("")}
        ${e.isSelectMode?"":'<div class="pp-add" id="addPP">+</div>'}
      </div>
      <div class="dialog-footer">
        <button class="btn ghost" data-edit>Edit details</button>
        <button class="btn" data-close>Done</button>
      </div>
    </div>
  `,document.body.appendChild(s),o&&(s.querySelector(".dialog").scrollTop=o),document.body.classList.add("no-scroll"),s.addEventListener("click",c=>{c.target===s&&(e.openPlaceId=null,document.body.classList.remove("no-scroll"),s.remove())}),s.querySelectorAll("[data-close]").forEach(c=>c.onclick=()=>{e.openPlaceId=null,document.body.classList.remove("no-scroll"),s.remove()}),s.querySelector("[data-edit]").onclick=()=>{e.isSelectMode=!1,e.selectedPhotos=[],document.body.classList.remove("no-scroll"),s.remove(),Y(t)};let r=s.querySelector("#startPlaceSelect");r&&(r.onclick=()=>{let c=s.querySelector(".dialog").scrollTop;e.isSelectMode=!e.isSelectMode,e.selectedPhotos=[],s.remove(),O(c)});let n=s.querySelector("#bulkDeletePlaceBtn");n&&e.selectedPhotos.length>0&&(n.onclick=async()=>{if(await h(`Delete ${e.selectedPhotos.length} photos?`,{isConfirm:!0,isDanger:!0})){let c=[...i],u=e.selectedPhotos.filter(y=>y.startsWith("legacy-")).map(y=>parseInt(y.split("-")[1])).sort((y,g)=>g-y);u.forEach(y=>c.splice(y,1)),u.length>0&&Store.updatePlace(t.id,{photos:c}),e.selectedPhotos.filter(y=>!y.startsWith("legacy-")).forEach(y=>Store.removePhoto(y)),e.selectedPhotos=[],e.isSelectMode=!1,s.remove(),O()}});let p=s.querySelector("#addPP");p&&(p.onclick=()=>te(t.id)),s.querySelectorAll(".pp").forEach(c=>{c.onclick=u=>{if(u.target.matches("[data-legacy-ppdel], [data-ppdel]"))return;let y=c.dataset.ppid||c.dataset.ppi;if(e.isSelectMode){let g=c.querySelector(".m-sel-check");e.selectedPhotos.includes(y)?(e.selectedPhotos=e.selectedPhotos.filter($=>$!==y),c.classList.remove("selected"),g&&(g.textContent="")):(e.selectedPhotos.push(y),c.classList.add("selected"),g&&(g.textContent="\u2713"))}else if(c.dataset.ppid){let g=Store.get().photos.find($=>$.id===c.dataset.ppid);g&&D(g)}else D({url:i[parseInt(c.dataset.ppi.split("-")[1])],caption:t.name,date:t.date})}})}function te(o){let a=document.createElement("div");a.className="scrim",a.innerHTML=`
    <div class="dialog">
      <h2>Add a photo</h2>
      <div class="field"><label>Image URL</label><input id="purl"></div>
      <div class="field"><label>Or upload</label><input type="file" id="pfile" accept="image/*" multiple></div>
      <div class="dialog-actions">
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>Add</button>
      </div>
    </div>
  `,document.body.appendChild(a),a.querySelector("[data-cancel]").onclick=()=>a.remove(),a.querySelector("[data-save]").onclick=async()=>{let t=document.getElementById("purl").value.trim(),l=document.getElementById("pfile").files;if(!t&&l.length===0){alert("add a URL or select files first");return}let i=a.querySelector("[data-save]");i.textContent="Adding...",i.disabled=!0;try{let s=Store.get().places.find(r=>r.id===o);t&&Store.addPhoto({url:t,caption:s.name,date:s.date,placeId:s.id});for(let r=0;r<l.length;r++){let n=await P(l[r]);Store.addPhoto({url:n,caption:s.name,date:s.date,placeId:s.id})}a.remove(),v()}catch(s){alert(s.message),i.textContent="Add",i.disabled=!1}}}function Y(o){let a=!!o,t=o||{name:"",note:"",lat:"",lng:"",date:new Date().toISOString().slice(0,10),photos:[]},l=document.createElement("div");l.className="scrim",l.innerHTML=`
    <div class="dialog">
      <h2>${a?"Edit place":"A new place"}</h2>
      <div class="field"><label>Name</label><input id="nname" value="${d(t.name)}"></div>
      <div class="field"><label>Date</label><input type="date" id="ndate" value="${d(t.date)}"></div>
      <div class="field"><label>Note</label><textarea id="nnote">${d(t.note)}</textarea></div>
      <div style="display:none"><input id="nlat" value="${d(t.lat)}"><input id="nlng" value="${d(t.lng)}"></div>
      <div class="field">
        <label>Location</label>
        <div style="display:flex;gap:8px;margin-bottom:8px"><input id="locSearch" style="flex:1"><button class="btn soft" id="locSearchBtn">Search</button></div>
        <div id="miniMap" style="height:220px;border-radius:8px;border:1px solid #d9dcd0"></div>
      </div>
      <div class="dialog-actions">
        ${a?'<button class="btn soft" data-del style="color:#a86060">Delete</button>':""}
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>Save</button>
      </div>
    </div>
  `,document.body.appendChild(l);let i;setTimeout(async()=>{await T(),await q();let s=document.getElementById("miniMap");if(!s)return;i=echarts.init(s);let r=parseFloat(t.lat)||20,n=parseFloat(t.lng)||0,p=(c,u)=>{i.setOption({backgroundColor:"#1a2118",geo:{map:"world",roam:!0,center:[u,c],zoom:t.lat?5:1.2},series:[{type:"scatter",coordinateSystem:"geo",data:[[u,c]],symbol:"pin",symbolSize:18,itemStyle:{color:"#e6b99a"}}]})};p(r,n),i.getZr().on("click",c=>{let u=i.convertFromPixel("geo",[c.offsetX,c.offsetY]);u&&(document.getElementById("nlng").value=u[0].toFixed(6),document.getElementById("nlat").value=u[1].toFixed(6),p(u[1],u[0]))})},50),l.querySelector("#locSearchBtn").onclick=async()=>{let s=document.getElementById("locSearch").value.trim();if(s)try{let n=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(s)}&limit=1`)).json();if(n&&n.length>0){let p=parseFloat(n[0].lat),c=parseFloat(n[0].lon);document.getElementById("nlat").value=p.toFixed(6),document.getElementById("nlng").value=c.toFixed(6),i&&i.setOption({geo:{center:[c,p],zoom:5},series:[{data:[[c,p]]}]})}}catch{alert("Search failed")}},l.querySelector("[data-cancel]").onclick=()=>l.remove(),l.querySelector("[data-save]").onclick=async()=>{let s={name:document.getElementById("nname").value.trim(),note:document.getElementById("nnote").value.trim(),date:document.getElementById("ndate").value,lat:parseFloat(document.getElementById("nlat").value),lng:parseFloat(document.getElementById("nlng").value)};a?Store.updatePlace(t.id,s):Store.addPlace(s),l.remove(),e.openPlaceId=null,v()},a&&(l.querySelector("[data-del]").onclick=async()=>{await h("Delete this place?",{isConfirm:!0,isDanger:!0})&&(Store.removePlace(t.id),l.remove(),e.openPlaceId=null,v())})}async function J(){let a=Store.get().songs,t=a[0]||null;e.root.innerHTML=`
    ${S()}
    <div class="page">
      ${x("playlist")}
      <div class="playlist-header">
        <div class="eyebrow">Our Playlist</div>
        <h1 class="page-title">Songs of <em>us</em></h1>
      </div>
      <div class="playlist-main">
        ${t?`
          <div class="now-playing-card">
            <div class="player-cover-wrap"><img src="${d(t.cover)}" class="player-cover"><div class="vinyl-disc"></div></div>
            <div class="player-info"><h2>${d(t.title)}</h2><div class="artist">${d(t.artist)}</div></div>
            <div class="p-progress"><div class="p-bar"></div></div>
            <div class="player-controls">
              <button class="p-btn" id="skipBackBtn">${m("skipBack")}</button>
              <button class="p-btn main" id="playActive">${m("play")}</button>
              <button class="p-btn" id="skipForwardBtn">${m("skipForward")}</button>
            </div>
            <div class="vol-control">${m("volume")}<input type="range" id="volSlider" min="0" max="100" value="${e.ytVol}"></div>
            ${t.ytUrl?'<div id="yt-player-frame" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none"></div>':""}
          </div>
        `:'<div class="empty">No songs yet.</div>'}
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px">
            <h3 style="font-family:var(--serif); font-size:24px">Tracklist</h3>
            <button class="btn" id="addSongBtn">${m("plus")} Add song</button>
          </div>
          <div class="song-grid">
            ${a.map(s=>`
              <div class="song-card" data-sid="${d(s.id)}">
                <img src="${d(s.cover)}">
                <h4>${d(s.title)}</h4>
                <p>${d(s.artist)}</p>
                <button class="m-edit" data-sedit="${d(s.id)}">${m("edit")}</button>
                <button class="m-del" data-sdel="${d(s.id)}">\xD7</button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `,b();let l=document.getElementById("playActive");if(l&&((!e.ytPlayer||typeof e.ytPlayer.playVideo!="function")&&(l.style.opacity="0.5",l.style.cursor="wait"),l.onclick=()=>{if(Store.log("debug","Play button clicked",{hasPlayer:!!e.ytPlayer,ytState:e.ytState}),!e.ytPlayer||typeof e.ytPlayer.playVideo!="function"){Store.log("debug","Player not ready, setting autoPlayNext"),e.autoPlayNext=!0;return}e.ytState===1?(Store.log("debug","Pausing video"),e.ytPlayer.pauseVideo()):(Store.log("debug","Playing video"),e.ytPlayer.playVideo())}),t&&t.ytUrl)if(Store.log("debug","Loading YouTube API",{url:t.ytUrl}),await M(),window.YT&&window.YT.Player){let s=C(t.ytUrl);if(Store.log("debug","Parsed YouTube URL",s),s.id){if(e.ytPlayer){Store.log("debug","Destroying existing player");try{e.ytPlayer.destroy()}catch{}e.ytPlayer=null,e.ytState=-1}Store.log("debug","Creating new YT.Player",{videoId:s.id}),e.ytPlayer=new YT.Player("yt-player-frame",{height:"1px",width:"1px",videoId:s.id,host:"https://www.youtube.com",playerVars:{start:s.start,autoplay:e.autoPlayNext?1:0,origin:window.location.origin,enablejsapi:1},events:{onReady:r=>{Store.log("debug","Player onReady",{autoPlayNext:e.autoPlayNext}),l&&(l.style.opacity="1",l.style.cursor="pointer"),r.target.setVolume(e.ytVol),e.autoPlayNext&&(e.autoPlayNext=!1,r.target.playVideo())},onStateChange:r=>{Store.log("debug","Player onStateChange",{newState:r.data}),e.ytState=r.data;let n=document.querySelector(".player-cover-wrap");l&&(l.innerHTML=m(e.ytState===1?"pause":"play")),n&&n.classList.toggle("playing",e.ytState===1),e.ytState===0&&(Store.log("debug","Video ended, skipping to next"),document.getElementById("skipNextBtn").click())},onError:r=>{Store.log("error","YouTube Player Error",{errorCode:r.data})}}})}}else Store.log("error","YouTube API loaded but YT.Player not found");document.getElementById("skipBackBtn").onclick=()=>{a.length<2||(e.autoPlayNext=!1,Store.set(s=>{let r=s.songs.pop();s.songs.unshift(r)}),v())},document.getElementById("skipForwardBtn").onclick=()=>{a.length<2||(e.autoPlayNext=!1,Store.set(s=>{let r=s.songs.shift();s.songs.push(r)}),v())};let i=document.getElementById("volSlider");i&&(i.oninput=s=>{e.ytVol=parseInt(s.target.value),e.ytPlayer&&e.ytPlayer.setVolume&&e.ytPlayer.setVolume(e.ytVol)}),document.getElementById("addSongBtn").onclick=()=>G(),document.querySelectorAll("[data-sedit]").forEach(s=>{s.onclick=r=>{r.stopPropagation();let n=a.find(p=>p.id===s.dataset.sedit);n&&G(n)}}),document.querySelectorAll(".song-card").forEach(s=>{s.onclick=r=>{if(r.target.closest(".m-del")||r.target.closest(".m-edit"))return;let n=s.dataset.sid,p=a.find(c=>c.id===n);if(p){e.autoPlayNext=!1;let c=a.filter(u=>u.id!==n);Store.set(u=>{u.songs=[p,...c]}),v()}}}),document.querySelectorAll("[data-sdel]").forEach(s=>{s.onclick=async r=>{r.stopPropagation(),await h("Remove this song?",{isConfirm:!0,isDanger:!0})&&(Store.removeSong(s.dataset.sdel),v())}})}function G(o=null){let a=!!o,t=document.createElement("div");t.className="scrim",t.innerHTML=`
    <div class="dialog">
      <h2>${a?"Edit Song":"Add to Playlist"}</h2>
      <div class="field"><label>Song Title</label><input type="text" id="stitle" value="${d(o?.title||"")}"></div>
      <div class="field"><label>Artist</label><input type="text" id="sartist" value="${d(o?.artist||"")}"></div>
      <div class="field"><label>YouTube Link</label><input type="text" id="syt" value="${d(o?.ytUrl||"")}"></div>
      <div class="field"><label>Cover Image</label><input type="file" id="scover" accept="image/*"></div>
      <div class="dialog-actions">
        <button class="btn ghost" onclick="this.closest('.scrim').remove()">Cancel</button>
        <button class="btn" id="saveSongBtn">${a?"Save Changes":"Add Song"}</button>
      </div>
    </div>
  `,document.body.appendChild(t),document.getElementById("saveSongBtn").onclick=async()=>{let l=document.getElementById("stitle").value,i=document.getElementById("sartist").value,s=document.getElementById("syt").value,r=document.getElementById("scover").files[0];if(!l||!i)return alert("Please enter title and artist");let n=document.getElementById("saveSongBtn");n.disabled=!0,n.textContent="Saving...";try{let p=o?o.cover:'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">\u{1F3B5}</text></svg>';r&&(p=await P(r));let c={title:l,artist:i,ytUrl:s,cover:p};a?Store.updateSong(o.id,c):Store.addSong(c),t.remove(),v()}catch{alert("Failed to process image"),n.disabled=!1}}}window.onerror=(o,a,t,l,i)=>{Store.log("error",o,{url:a,line:t,col:l,stack:i?i.stack:null})};window.onunhandledrejection=o=>{Store.log("promise_error",o.reason?o.reason.message:"unknown",{stack:o.reason?o.reason.stack:null})};function _(){let o=location.hash.replace("#/","")||"home",[a,...t]=o.split("/");return{path:a,params:t}}window.addEventListener("hashchange",v);function K(){let o=document.getElementById("skeletonLoader");o&&!o.classList.contains("hidden")&&(setTimeout(()=>o.classList.add("hidden"),500),setTimeout(()=>o.remove(),1e3))}async function v(){let o=_();if(Store.log("debug","Rendering route: "+o.path),j(),e.ytPlayer){try{e.ytPlayer.destroy()}catch{}e.ytPlayer=null,e.ytState=-1}if(document.querySelectorAll(".scrim").forEach(l=>l.remove()),!Store.get().session.unlocked){U(),K();return}switch(_().path){case"home":H();break;case"letters":F();break;case"gallery":k();break;case"map":await R();break;case"playlist":await J();break;default:location.hash="#/home"}K()}window.state=e;Store.init().then(()=>{v(),A()});})();
