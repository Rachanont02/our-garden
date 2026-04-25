(()=>{var t={root:document.getElementById("root"),adminOpen:!1,openLetter:null,openPlaceId:null,gallerySearch:"",ytPlayer:null,ytState:-1,ytVol:100,autoPlayNext:!1,selectedPhotos:[],isSelectMode:!1,worldGeoJSON:null,isIOS:/iPad|iPhone|iPod/.test(navigator.userAgent),devMode:localStorage.getItem("devMode")==="true",logs:[]};var E=null;function T(){return E||(E=new Promise((a,o)=>{if(window.L)return a();let e=document.createElement("link");e.rel="stylesheet",e.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(e);let l=document.createElement("script");l.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",l.onload=a,l.onerror=o,document.head.appendChild(l)}),E)}var I=null;function M(){return I||(I=new Promise(a=>{if(window.YT&&window.YT.Player)return a();let o=document.querySelector('script[src*="youtube.com/iframe_api"]'),e=()=>{window.YT&&window.YT.Player?a():setTimeout(e,100)};if(o)e();else{window.onYouTubeIframeAPIReady=()=>a();let l=document.createElement("script");l.src="https://www.youtube.com/iframe_api",document.head.appendChild(l)}}),I)}function U(){try{["map","miniMap"].forEach(a=>{let o=document.getElementById(a);if(o){if(window.echarts){let e=echarts.getInstanceByDom(o);e&&e.dispose()}o._leaflet_map&&(o._leaflet_map.remove(),delete o._leaflet_map)}})}catch{}}var K={heart:'<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',photo:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 17-5-5-9 9"/>',letter:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',map:'<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16M15 5v16"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',plus:'<path d="M12 5v14M5 12h14"/>',trash:'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',upload:'<path d="M12 21V9m-4 4 4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',play:'<path d="m5 3 14 9-14 9V3z"/>',pause:'<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',skipBack:'<path d="M19 20 9 12l10-8v16zM5 19V5"/>',skipForward:'<path d="m5 4 10 8-10 8V4zM19 5v14"/>',edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>'},m=a=>`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${K[a]}</svg>`;function d(a){return String(a??"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function w(a){return a?new Date(a+(a.length===10?"T00:00:00":"")).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):""}function B(a){return a?new Date(a+(a.length===10?"T00:00:00":"")).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}):""}function f(a,{isConfirm:o=!1,isDanger:e=!1}={}){return document.activeElement&&document.activeElement.blur&&document.activeElement.blur(),new Promise(l=>{let c=document.createElement("div");c.className="scrim",c.style.zIndex="9999",c.innerHTML=`
      <div class="dialog" style="max-width:380px;text-align:center;padding:34px 24px;">
        <div class="leaf-decor" style="font-size:32px;margin-bottom:12px;opacity:0.8;">\u2766</div>
        <div class="dsub" style="font-size:17px;color:var(--ink);margin-bottom:28px;">${d(a)}</div>
        <div class="dialog-actions" style="justify-content:center;gap:12px">
          ${o?'<button class="btn ghost" data-c>Cancel</button>':""}
          <button class="btn" data-o style="${e?"background:#a86060;border-color:#a86060":""}">${o?e?"Delete":"Yes":"OK"}</button>
        </div>
      </div>
    `,document.body.appendChild(c);let n=p=>{c.remove(),l(p)},s=null;o&&(s=c.querySelector("[data-c]"),s.onclick=()=>n(!1));let i=c.querySelector("[data-o]");i.onclick=()=>n(!0),s||(s=i),setTimeout(()=>s.focus(),10)})}function N(a){let o=new Date(a+"T00:00:00"),e=new Date,l=e.getFullYear()-o.getFullYear(),c=e.getMonth()-o.getMonth(),n=e.getDate()-o.getDate();if(n<0){c--;let r=new Date(e.getFullYear(),e.getMonth(),0);n+=r.getDate()}c<0&&(l--,c+=12);let s=Math.floor((e-o)/(1e3*60*60*24)),i=new Date(e.getFullYear(),o.getMonth(),o.getDate());i<e&&i.setFullYear(e.getFullYear()+1);let p=Math.ceil((i-e)/(1e3*60*60*24));return{years:l,months:c,days:n,totalDays:s,daysUntilAnniv:p}}function C(a){let o="",e=0;try{let l=new URL(a);l.hostname==="youtu.be"?(o=l.pathname.slice(1),e=parseInt(l.searchParams.get("t"))||0):(o=l.searchParams.get("v"),e=parseInt(l.searchParams.get("t"))||0)}catch{let c=a.match(/v=([^&]+)/)||a.match(/embed\/([^?]+)/);c&&(o=c[1])}return{id:o,start:e}}function P(a){return new Promise((o,e)=>{let l=/iPad|iPhone|iPod/.test(navigator.userAgent),c=l?1e3:1200,n=l?300*1024:500*1024,s=new Image,i=URL.createObjectURL(a);s.onload=()=>{URL.revokeObjectURL(i);let{width:p,height:r}=s;if(p>c||r>c){let z=Math.min(c/p,c/r);p=Math.round(p*z),r=Math.round(r*z)}let u=document.createElement("canvas");u.width=p,u.height=r;let v=u.getContext("2d");v.imageSmoothingEnabled=!0,v.imageSmoothingQuality="high",v.drawImage(s,0,0,p,r);let g=.9,$=u.toDataURL("image/jpeg",g);for(;$.length>n&&g>.3;)g-=.05,$=u.toDataURL("image/jpeg",g);o($)},s.onerror=()=>{if(URL.revokeObjectURL(i),a.size>1024*1024){e(new Error("Image format not supported for compression and file is too large."));return}let p=new FileReader;p.onload=()=>o(p.result),p.onerror=()=>e(p.error),p.readAsDataURL(a)},s.src=i})}function X(){let a=document.createElement("div");a.className="scrim",a.style.zIndex="3000",a.innerHTML=`
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
  `,document.body.appendChild(a),Store.getLogs(100).then(o=>{let e=document.getElementById("log-list");if(!o||o.length===0){e.innerHTML="No logs found in cloud.";return}e.innerHTML=o.map(l=>{let c=new Date(l.ts).toLocaleString();return`<div style="margin-bottom:12px; border-bottom:1px solid #222; padding-bottom:8px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px">
            <span style="color:${l.type==="error"||l.type==="promise_error"?"#ff6b6b":l.type==="debug"?"#4dabf7":"#a9e34b"}; font-weight:bold;">[${l.type.toUpperCase()}]</span>
            <span style="color:#666; font-size:11px;">${c}</span>
          </div>
          <div style="color:#fff; margin-bottom:4px">${d(l.msg)}</div>
          ${l.placeId?`<div style="color:#ffd43b">Place ID: ${l.placeId}</div>`:""}
          ${l.photoId?`<div style="color:#ffd43b">Photo ID: ${l.photoId}</div>`:""}
          ${l.stack?`<div style="color:#888; font-size:11px; background:#1a1a1a; padding:8px; border-radius:6px; margin:6px 0; overflow-x:auto;">${d(l.stack)}</div>`:""}
          <div style="color:#555; font-size:10px; margin-top:4px;">Device: ${d(l.ua)}</div>
        </div>`}).join("")}).catch(o=>{let e=document.getElementById("log-list");e&&(e.innerHTML="Failed to load logs: "+d(o.message))})}function h(){if(document.querySelectorAll(".drawer-scrim, .drawer").forEach(s=>s.remove()),!t.adminOpen)return;let a=Store.get(),o=document.createElement("div");o.className="drawer-scrim",o.style.cssText="position:fixed;inset:0;background:rgba(40,46,30,.35);backdrop-filter:blur(4px);z-index:89",document.body.appendChild(o);let e=document.createElement("div");e.className="drawer open",e.innerHTML=`
    <button class="closeX" data-close>\xD7</button>
    <h2>Garden settings</h2>
    <div class="ds">tend to the details of our little place</div>

    <div class="drawer-section">
      <h3>About us</h3>
      <div class="field"><label>Your name</label><input id="aname1" value="${d(a.couple.name1)}"></div>
      <div class="field"><label>Their name</label><input id="aname2" value="${d(a.couple.name2)}"></div>
      <div class="field"><label>Motto / subtitle</label><input id="amotto" value="${d(a.couple.motto)}"></div>
      <div class="field"><label>Anniversary (this is also your password)</label><input type="date" id="aanniv" value="${d(a.couple.anniversary)}"></div>
      <button class="btn" id="saveCouple">Save</button>
    </div>

    ${t.devMode?`
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

    <div class="drawer-section" style="background:${t.devMode?"#e0f0f0":"#faf6ed"}">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
        <h3 style="margin:0">Dev Mode</h3>
        <label class="switch">
          <input type="checkbox" id="devToggle" ${t.devMode?"checked":""}>
          <span class="slider"></span>
        </label>
      </div>
      <div class="ds" style="margin-bottom:0">enable debug logs on screen</div>
    </div>

    <div class="drawer-section" style="background:#f6ecea;border-color:#e4cfcb">
      <h3 style="color:#a86060">Danger</h3>
      <button class="btn soft" id="resetBtn" style="color:#a86060;border-color:#d9b4ae">Reset everything</button>
    </div>
  `,document.body.appendChild(e),e.querySelector("#devToggle").onchange=s=>{t.devMode=s.target.checked,localStorage.setItem("devMode",t.devMode),q(),h()},o.onclick=()=>{t.adminOpen=!1,h()},e.querySelector("[data-close]").onclick=()=>{t.adminOpen=!1,h()},e.querySelector("#saveCouple").onclick=()=>{Store.setCouple({name1:document.getElementById("aname1").value.trim(),name2:document.getElementById("aname2").value.trim(),motto:document.getElementById("amotto").value.trim()||"our little garden",anniversary:document.getElementById("aanniv").value}),t.adminOpen=!1,h(),y()},e.querySelector("#exportBtn").onclick=()=>Store.exportJSON(),e.querySelector("#logsBtn").onclick=()=>{t.adminOpen=!1,h(),X()};let l=e.querySelector("#connectCloudBtn");l&&(l.onclick=()=>W());let c=e.querySelector("#pushCloudBtn");c&&(c.onclick=()=>Store.pushLocalToCloud());let n=e.querySelector("#disconnectCloudBtn");n&&(n.onclick=async()=>{await f("Disconnect cloud sync? Local data stays.",{isConfirm:!0})&&(await Store.disconnectCloud(),t.adminOpen=!1,h(),setTimeout(()=>{t.adminOpen=!0,h()},50))}),e.querySelector("#importBtn").onchange=async s=>{let i=s.target.files[0];if(i)try{await Store.importJSON(i),alert("imported \u2661"),t.adminOpen=!1,h(),y()}catch(p){alert("import failed: "+p.message)}},e.querySelector("#resetBtn").onclick=async()=>{await f("Really clear everything? This cannot be undone.",{isConfirm:!0,isDanger:!0})&&(Store.resetAll(),t.adminOpen=!1,h(),location.hash="#/home",y())}}function W(){let a=Store.cloud.config||{},o=document.createElement("div");o.className="scrim",o.innerHTML=`
    <div class="dialog" style="max-width:560px">
      <h2>Connect to Firebase</h2>
      <div class="dsub">paste your firebaseConfig from the Firebase console</div>
      <div class="field">
        <label>firebaseConfig (paste the whole object)</label>
        <textarea id="fbcfg" style="font-family:monospace;font-size:13px;min-height:180px" placeholder='{ "apiKey": "...", "projectId": "...", ... }'>${a.apiKey?JSON.stringify(a,null,2):""}</textarea>
      </div>
      <div class="dialog-actions">
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-connect>Connect</button>
      </div>
    </div>
  `,document.body.appendChild(o),o.querySelector("[data-cancel]").onclick=()=>o.remove(),o.querySelector("[data-connect]").onclick=async()=>{let e=document.getElementById("fbcfg").value.trim(),l;try{l=JSON.parse(e)}catch{try{let n=e.replace(/^\s*(const|let|var)\s+\w+\s*=\s*/,"").replace(/;?\s*$/,"");l=Function('"use strict";return('+n+")")()}catch{alert("invalid config format");return}}if(!l.apiKey||!l.projectId){alert("missing apiKey or projectId");return}await Store.connectCloud(l)&&(o.remove(),t.adminOpen=!1,h(),setTimeout(()=>{t.adminOpen=!0,h()},50),alert("Connected to cloud \u2661"))}}function q(){let a=document.getElementById("debug-panel");if(!t.devMode){a&&a.remove();return}a||(a=document.createElement("div"),a.id="debug-panel",a.style.cssText=`
      position:fixed; bottom:20px; right:20px; width:300px; height:200px;
      background:rgba(0,0,0,0.8); color:#0f0; font-family:monospace; font-size:10px;
      padding:10px; border-radius:10px; z-index:9999; overflow-y:auto;
      pointer-events:none; border:1px solid #0f0; box-shadow: 0 0 20px rgba(0,255,0,0.2);
    `,document.body.appendChild(a),window.addEventListener("sage-log",o=>{let e=o.detail,l=document.createElement("div");l.style.marginBottom="4px",l.textContent=`[${e.type}] ${e.msg}`,a.appendChild(l),a.scrollTop=a.scrollHeight})),a.innerHTML=t.logs.slice(0,50).reverse().map(o=>`<div>[${o.type}] ${o.msg}</div>`).join(""),a.scrollTop=a.scrollHeight}function b(){let a=document.getElementById("adminBtn");a&&(a.onclick=()=>{t.adminOpen=!t.adminOpen,h()});let o=document.getElementById("lockBtn");o&&(o.onclick=()=>{Store.lock(),y()})}function x(){let a=Store.get();return`
  <div class="topbar">
    <div class="brand">${d(a.couple.name1||"you")} <span class="brand-dot"></span> <em>${d(a.couple.name2||"me")}</em></div>
    <div class="topbar-right">
      <button class="icon-btn" id="adminBtn" title="Manage content">${m("settings")}</button>
      <button class="icon-btn" id="lockBtn" title="Lock">${m("lock")}</button>
    </div>
  </div>`}function S(a){return`<nav class="menu-nav">${[["home","Home"],["gallery","Gallery"],["letters","Love Notes"],["map","Our Map"],["playlist","Our Playlist"]].map(([e,l])=>`<a href="#/${e}" class="${a===e?"active":""}">${l}</a>`).join("")}</nav>`}function O(){t.root.innerHTML=`
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
  </div>`,document.getElementById("loginForm").addEventListener("submit",a=>{a.preventDefault();let o=document.getElementById("pwd").value.replace(/\D/g,""),e=Store.get().couple.anniversary,[l,c,n]=e.split("-"),s=`${n}${c}${l}`,i=`${l}${c}${n}`,p=`${n}${c}${l.slice(2)}`;o===s||o===i||o===p?(Store.unlock(),location.hash="#/home",y()):(document.getElementById("err").textContent="not quite \u2014 try the date we began",document.getElementById("pwd").value="")})}function j(){let a=Store.get(),o=N(a.couple.anniversary);t.root.innerHTML=`
    ${x()}
    <div class="page">
      ${S("home")}
      <div class="home-hero">
        <div class="home-motto">${d(a.couple.motto)}</div>
        <h1 class="home-title">${d(a.couple.name1||"us")} <em>&amp;</em> ${d(a.couple.name2||"us")}</h1>
      </div>
      <div class="counter-row">
        <div class="c-cell"><div class="c-num">${o.years}</div><div class="c-lbl">year${o.years===1?"":"s"}</div><div class="c-corner"></div></div>
        <div class="c-cell"><div class="c-num">${o.months}</div><div class="c-lbl">month${o.months===1?"":"s"}</div><div class="c-corner"></div></div>
        <div class="c-cell"><div class="c-num">${o.days}</div><div class="c-lbl">day${o.days===1?"":"s"}</div><div class="c-corner"></div></div>
      </div>
      <div class="total-row">
        <div class="total-cell"><span class="k">Since we began</span><span class="v">${o.totalDays.toLocaleString()} days</span></div>
        <div class="total-cell"><span class="k">Next anniversary in</span><span class="v">${o.daysUntilAnniv} days</span></div>
      </div>
      <div class="quick-grid">
        ${a.songs.length>0?(()=>{let c=a.songs[Math.floor(Math.random()*a.songs.length)];return`
          <div class="home-playlist-card" id="homeSongCard" data-yt="${d(c.ytUrl||"")}">
            <div class="hp-vinyl" id="homeVinyl"><img src="${d(c.cover)}" class="hp-cover"></div>
            <div class="hp-info">
              <div class="label">Our song of the day</div>
              <div class="title">${d(c.title)}</div>
              <div class="artist">${d(c.artist)}</div>
            </div>
            <div class="hp-play-btn" style="font-size:24px; cursor:pointer; z-index:2" id="homePlayIcon">${m("play")}</div>
            <div id="home-yt-frame" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none"></div>
          </div>`})():""}
        <a href="#/gallery" class="q-card">
          <div class="qico">${m("photo")}</div>
          <h3>Our Gallery</h3>
          <div class="qc"><span>${a.photos.length} photos</span><span class="qarr">\u2192</span></div>
        </a>
        <a href="#/letters" class="q-card">
          <div class="qico">${m("letter")}</div>
          <h3>Love Notes</h3>
          <div class="qc"><span>${a.letters.length} letters</span><span class="qarr">\u2192</span></div>
        </a>
        <a href="#/map" class="q-card">
          <div class="qico">${m("map")}</div>
          <h3>Our Map</h3>
          <div class="qc"><span>${a.places.length} places</span><span class="qarr">\u2192</span></div>
        </a>
      </div>
    </div>
  `,b();let e=document.getElementById("homeSongCard"),l=document.getElementById("homePlayIcon");if(e&&l){let c=e.dataset.yt;if(c){let n=async()=>{if(t.ytPlayer||(l&&(l.style.opacity="0.5",l.style.cursor="wait"),await M(),!window.YT||!window.YT.Player))return;let s=C(c);s.id&&(t.ytPlayer=new YT.Player("home-yt-frame",{height:"1px",width:"1px",videoId:s.id,host:"https://www.youtube.com",playerVars:{start:s.start,autoplay:1,origin:window.location.origin},events:{onReady:i=>{l&&(l.style.opacity="1",l.style.cursor="pointer"),i.target.setVolume(t.ytVol),i.target.playVideo()},onStateChange:i=>{let p=i.data,r=document.getElementById("homeVinyl");l&&(l.innerHTML=m(p===1?"pause":"play")),r&&r.classList.toggle("playing",p===1)}}}))};l.onclick=s=>{if(s.stopPropagation(),!t.ytPlayer){n();return}t.ytPlayer.getPlayerState&&t.ytPlayer.getPlayerState()===1?t.ytPlayer.pauseVideo():t.ytPlayer.playVideo&&t.ytPlayer.playVideo()},e.onclick=s=>{s.target.closest("#homePlayIcon")||(location.hash="#/playlist")}}else e.onclick=()=>location.hash="#/playlist"}else e&&(e.onclick=()=>location.hash="#/playlist")}function k(){let a=Store.get(),o=t.gallerySearch.toLowerCase(),e=a.photos.filter(i=>!i.placeId&&(!o||(i.caption||"").toLowerCase().includes(o)||(i.date||"").includes(o)));t.root.innerHTML=`
    ${x()}
    <div class="page">
      ${S("gallery")}
      <div class="page-header" style="text-align:center">
        <div class="eyebrow">Our Gallery</div>
        <h1 class="page-title">Moments, <em>remembered</em></h1>
        <div class="page-sub">every quiet thing, kept</div>
      </div>
      <div class="gallery-toolbar">
        <div class="search-box">${m("search")}<input type="text" placeholder="search..." id="gsearch" value="${d(t.gallerySearch)}"></div>
        <div style="display:flex;gap:8px">
          ${t.isSelectMode?`<button class="btn soft" id="cancelSelect">Cancel</button><button class="btn" id="bulkDeleteBtn" style="background:#a86060;border-color:#a86060">${m("trash")} Delete (${t.selectedPhotos.length})</button>`:`<button class="btn soft" id="startSelect">${m("heart")} Select</button><button class="btn" id="addPhotoBtn">${m("plus")} Add photo</button>`}
        </div>
      </div>
      ${e.length===0?`<div class="empty"><span class="leaf">\u2766</span>${t.gallerySearch?"no moments match that":"no photos yet"}</div>`:`
        <div class="masonry ${t.isSelectMode?"select-mode":""}">
          ${e.map(i=>{let p=t.selectedPhotos.includes(i.id);return`
              <div class="m-item ${p?"selected":""}" data-photo="${d(i.id)}">
                ${i.url?`<img src="${d(i.url)}" alt="${d(i.caption||"")}" loading="lazy">`:'<div class="m-ph">photo placeholder</div>'}
                <div class="m-sel-check">${p?"\u2713":""}</div>
                ${t.isSelectMode?"":`<button class="m-del" data-del="${d(i.id)}" title="Remove">\xD7</button>`}
                ${i.caption||i.date?`<div class="mcap"><span>${d(i.caption||"")}</span><span class="mdate">${d(w(i.date))}</span></div>`:""}
              </div>
            `}).join("")}
        </div>`}
    </div>
  `,b();let l=document.getElementById("addPhotoBtn");l&&(l.onclick=()=>Q());let c=document.getElementById("startSelect");c&&(c.onclick=()=>{t.isSelectMode=!0,t.selectedPhotos=[],k()});let n=document.getElementById("cancelSelect");n&&(n.onclick=()=>{t.isSelectMode=!1,t.selectedPhotos=[],k()});let s=document.getElementById("bulkDeleteBtn");s&&t.selectedPhotos.length>0&&(s.onclick=async()=>{await f(`Delete ${t.selectedPhotos.length} photos?`,{isConfirm:!0,isDanger:!0})&&(t.selectedPhotos.forEach(i=>Store.removePhoto(i)),t.selectedPhotos=[],t.isSelectMode=!1,k())}),document.getElementById("gsearch").oninput=i=>{t.gallerySearch=i.target.value,k()},t.root.querySelectorAll("[data-photo]").forEach(i=>{i.onclick=p=>{if(p.target.matches("[data-del]"))return;let r=i.dataset.photo;if(t.isSelectMode){let u=i.querySelector(".m-sel-check");t.selectedPhotos.includes(r)?(t.selectedPhotos=t.selectedPhotos.filter(g=>g!==r),i.classList.remove("selected"),u&&(u.textContent="")):(t.selectedPhotos.push(r),i.classList.add("selected"),u&&(u.textContent="\u2713"));let v=document.getElementById("bulkDeleteBtn");v&&(v.innerHTML=`${m("trash")} Delete (${t.selectedPhotos.length})`)}else{let u=Store.get().photos.find(v=>v.id===r);u&&D(u)}}}),t.root.querySelectorAll("[data-del]").forEach(i=>{i.onclick=async p=>{p.stopPropagation(),await f("Remove this photo?",{isConfirm:!0,isDanger:!0})&&(Store.removePhoto(i.dataset.del),k())}})}function Q(a){let o=!!a,e=a||{url:"",caption:"",date:new Date().toISOString().slice(0,10)},l=document.createElement("div");l.className="scrim",l.innerHTML=`
    <div class="dialog">
      <h2>${o?"Edit photo":"Add a memory"}</h2>
      <div class="field"><label>Image URL</label><input id="purl" value="${d(e.url)}"></div>
      <div class="field"><label>Or upload</label><input type="file" id="pfile" accept="image/*" multiple></div>
      <div class="field"><label>Caption</label><input id="pcap" value="${d(e.caption)}"></div>
      <div class="field"><label>Date</label><input type="date" id="pdate" value="${d(e.date)}"></div>
      <div class="dialog-actions">
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>Save</button>
      </div>
    </div>
  `,document.body.appendChild(l),document.body.classList.add("no-scroll"),l.querySelector("[data-cancel]").onclick=()=>{document.body.classList.remove("no-scroll"),l.remove()},l.querySelector("[data-save]").onclick=async()=>{let c=document.getElementById("purl").value.trim(),n=document.getElementById("pfile").files,s=document.getElementById("pcap").value.trim(),i=document.getElementById("pdate").value;if(!c&&n.length===0){alert("please add a URL or select files");return}let p=l.querySelector("[data-save]");p.textContent="Saving...",p.disabled=!0;try{if(o){let r=c;n.length>0&&(r=await P(n[0])),Store.updatePhoto(e.id,{url:r,caption:s,date:i})}else{c&&Store.addPhoto({url:c,caption:s,date:i});for(let r=0;r<n.length;r++){let u=await P(n[r]);Store.addPhoto({url:u,caption:s,date:i})}}document.body.classList.remove("no-scroll"),l.remove(),y()}catch(r){alert(r.message),p.textContent="Save",p.disabled=!1}}}function D(a){Store.log("debug","opening lightbox",{photoId:a.id}),document.body.classList.add("no-scroll");let o=document.createElement("div");o.className="lightbox",o.innerHTML=`
    <button class="lclose" aria-label="Close">\xD7</button>
    <button class="ldelete" aria-label="Delete">${m("trash")}</button>
    <img src="${d(a.url)}">
    ${a.caption||a.date?`<div class="lcap">${d(a.caption||"")}${a.caption&&a.date?" \xB7 ":""}${d(B(a.date))}</div>`:""}
  `,document.body.appendChild(o),o.addEventListener("click",e=>{(e.target===o||e.target.classList.contains("lclose"))&&(document.body.classList.remove("no-scroll"),o.remove())}),o.querySelector(".ldelete").onclick=async()=>{await f("Delete this memory?",{isConfirm:!0,isDanger:!0})&&(Store.removePhoto(a.id),document.body.classList.remove("no-scroll"),o.remove(),y())}}function H(){let a=Store.get();t.root.innerHTML=`
    ${x()}
    <div class="page">
      ${S("letters")}
      <div class="page-header" style="text-align:center">
        <div class="eyebrow">Love Notes</div>
        <h1 class="page-title">Letters, <em>for you</em></h1>
        <div class="page-sub">softly folded, kept in the drawer</div>
      </div>
      <div class="letters-grid">
        ${a.letters.map(o=>`
          <div class="envelope ${d(o.color||"peach")}" data-letter="${d(o.id)}">
            <div class="env-flap"></div>
            <div class="env-seal">\u2661</div>
            <div class="env-to">to ${d(o.to||"you")}</div>
            <div class="env-meta">
              <div class="env-date">${d(w(o.date))}</div>
              <div class="env-title">${d(o.title||"a little note")}</div>
            </div>
          </div>
        `).join("")}
        <div class="envelope add" id="addLetterBtn">
          <div style="text-align:center"><span>+</span><div>write a new note</div></div>
        </div>
      </div>
      ${a.letters.length===0?'<div class="empty" style="grid-column:1/-1"><span class="leaf">\u2766</span>no letters yet</div>':""}
    </div>
  `,b(),document.getElementById("addLetterBtn").onclick=()=>V(),t.root.querySelectorAll("[data-letter]").forEach(o=>{o.onclick=()=>{t.openLetter=o.dataset.letter,y()}}),t.openLetter&&Z()}function Z(){let o=Store.get().letters.find(l=>l.id===t.openLetter);if(!o){t.openLetter=null;return}let e=document.createElement("div");e.className="scrim letter-scrim",e.innerHTML=`
    <div class="dialog" role="dialog">
      <div class="letter-head">
        <div class="ld">${d(B(o.date))}</div>
        <div class="ld">${d(o.from||"")}</div>
      </div>
      <div class="letter-to">Dear <em>${d(o.to||"you")}</em>,</div>
      <div class="letter-body">${d(o.body||"")}</div>
      <div class="letter-sign">\u2014 always, ${d(o.from||"yours")}</div>
      <div class="letter-actions">
        <button class="btn ghost" data-edit>Edit</button>
        <button class="btn soft" data-close>Close</button>
      </div>
    </div>
  `,document.body.appendChild(e),e.addEventListener("click",l=>{l.target===e&&(t.openLetter=null,e.remove())}),e.querySelector("[data-close]").onclick=()=>{t.openLetter=null,e.remove()},e.querySelector("[data-edit]").onclick=()=>{e.remove(),V(o)}}function V(a){let o=!!a,e=a||{from:Store.get().couple.name1||"",to:Store.get().couple.name2||"",title:"",body:"",color:"peach",date:new Date().toISOString().slice(0,10)},l=document.createElement("div");l.className="scrim",l.innerHTML=`
    <div class="dialog">
      <h2>${o?"Edit note":"A new note"}</h2>
      <div class="field"><label>Title</label><input id="ltitle" value="${d(e.title)}" placeholder="a little note"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="field"><label>From</label><input id="lfrom" value="${d(e.from)}"></div>
        <div class="field"><label>To</label><input id="lto" value="${d(e.to)}"></div>
      </div>
      <div class="field"><label>Date</label><input type="date" id="ldate" value="${d(e.date)}"></div>
      <div class="field"><label>Letter</label><textarea id="lbody" placeholder="write from the heart...">${d(e.body)}</textarea></div>
      <div class="field"><label>Envelope color</label>
        <div class="color-swatches" id="swatches">
          ${["peach","sage","blush","sand","lavender"].map(n=>`<div class="sw ${n} ${e.color===n?"active":""}" data-color="${n}"></div>`).join("")}
        </div>
      </div>
      <div class="dialog-actions">
        ${o?'<button class="btn soft" data-del style="margin-right:auto;color:#a86060">Delete</button>':""}
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>${o?"Save":"Seal it"}</button>
      </div>
    </div>
  `,document.body.appendChild(l);let c=e.color;l.querySelectorAll(".sw").forEach(n=>n.onclick=()=>{c=n.dataset.color,l.querySelectorAll(".sw").forEach(s=>s.classList.toggle("active",s===n))}),l.querySelector("[data-cancel]").onclick=()=>l.remove(),l.querySelector("[data-save]").onclick=()=>{let n={title:document.getElementById("ltitle").value.trim()||"a little note",from:document.getElementById("lfrom").value.trim(),to:document.getElementById("lto").value.trim(),date:document.getElementById("ldate").value,body:document.getElementById("lbody").value,color:c};o?Store.updateLetter(e.id,n):Store.addLetter(n),l.remove(),t.openLetter=null,y()},o&&(l.querySelector("[data-del]").onclick=async()=>{await f("Delete this note?",{isConfirm:!0,isDanger:!0})&&(Store.removeLetter(e.id),l.remove(),t.openLetter=null,y())})}async function F(){let a=Store.get();if(t.root.innerHTML=`
    ${x()}
    <div class="page">
      ${S("map")}
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
          ${a.places.length===0?'<div class="empty" style="padding:40px 20px"><span class="leaf">\u2766</span>no places yet</div>':a.places.sort((s,i)=>new Date(i.date)-new Date(s.date)).map(s=>`
            <div class="place-item" data-place="${d(s.id)}">
              <h4>${d(s.name)}</h4>
              <div class="pd">${d(w(s.date))}</div>
              <div class="pcount">${(s.photos||[]).length+a.photos.filter(i=>i.placeId===s.id).length} photos \u2192</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `,b(),document.getElementById("addPlaceBtn").onclick=()=>R(),await T(),!window.L){t.root.querySelector("#map").innerHTML='<div class="empty"><span class="leaf">\u2766</span>Map failed to load.</div>';return}let o=document.getElementById("map");if(!o)return;let e=[59.91,10.75],l=L.map(o,{center:e,zoom:3,zoomControl:!1,attributionControl:!1});o._leaflet_map=l,L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{}).addTo(l);let c=[...a.places].sort((s,i)=>new Date(s.date)-new Date(i.date)).filter(s=>typeof s.lng=="number"&&typeof s.lat=="number"),n=[];if(c.forEach(s=>{let i=L.marker([s.lat,s.lng]).addTo(l);i.on("click",()=>{t.openPlaceId=s.id,y()});let p='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="106"><rect width="160" height="106" fill="%23f2f4ec"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">\u{1F4CD}</text></svg>';i.bindTooltip(`
      <div style="text-align:center; width: 140px; pointer-events: none;">
        <div style="font-family:serif; font-weight: 600; font-size: 14px; color:#2a3625;">${d(s.name)}</div>
        <div style="font-size: 10px; color:#7a8a60; margin-top: 2px;">${w(s.date)}</div>
      </div>`,{direction:"top",offset:[0,-10],opacity:.9}),Math.sqrt(Math.pow(s.lat-e[0],2)+Math.pow(s.lng-e[1],2))>.5&&L.polyline([e,[s.lat,s.lng]],{color:"#ffffff",weight:1,opacity:.3,dashArray:"5, 10"}).addTo(l),n.push(i)}),L.marker(e,{icon:L.divIcon({className:"home-marker",html:'<div style="font-size:24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5))">\u{1F3E0}</div>',iconSize:[30,30],iconAnchor:[15,15]})}).addTo(l).bindTooltip("Home",{direction:"top"}),n.length>0){let s=new L.featureGroup([...n,L.marker(e)]);l.fitBounds(s.getBounds().pad(.2))}t.root.querySelectorAll(".place-item").forEach(s=>{s.onclick=()=>{t.openPlaceId=s.dataset.place,y()}}),t.openPlaceId&&A()}function A(a=0){let o=Store.get(),e=o.places.find(r=>r.id===t.openPlaceId);if(!e){t.openPlaceId=null;return}let l=o.photos.filter(r=>r.placeId===e.id),c=e.photos||[],n=document.createElement("div");n.className="scrim",n.innerHTML=`
    <div class="dialog" style="max-width:680px">
      <div class="dialog-header">
        <div class="header-left">
          <div class="eyebrow">${d(B(e.date))}</div>
          <h2 style="margin:0">${d(e.name)}</h2>
        </div>
        <div style="display:flex;gap:8px">
          ${t.isSelectMode?`
            <button class="btn" id="bulkDeletePlaceBtn" style="background:#a86060">${m("trash")} Delete (${t.selectedPhotos.length})</button>
            <button class="btn soft" id="startPlaceSelect">Cancel</button>
          `:`
            <button class="btn soft" id="startPlaceSelect">${m("heart")} Select</button>
            <button class="icon-btn close-dialog" data-close>\xD7</button>
          `}
        </div>
      </div>
      ${e.note?`<div class="place-note">${d(e.note)}</div>`:""}
      <div class="place-photos ${t.isSelectMode?"select-mode":""}">
        ${c.map((r,u)=>{let v=`legacy-${u}`,g=t.selectedPhotos.includes(v);return`<div class="pp ${g?"selected":""}" data-ppi="${v}"><img src="${d(r)}" loading="lazy"><div class="m-sel-check">${g?"\u2713":""}</div>${t.isSelectMode?"":`<button class="m-del" data-legacy-ppdel="${u}">\xD7</button>`}</div>`}).join("")}
        ${l.map(r=>{let u=t.selectedPhotos.includes(r.id);return`<div class="pp ${u?"selected":""}" data-ppid="${d(r.id)}"><img src="${d(r.url)}" loading="lazy"><div class="m-sel-check">${u?"\u2713":""}</div>${t.isSelectMode?"":`<button class="m-del" data-ppdel="${d(r.id)}">\xD7</button>`}</div>`}).join("")}
        ${t.isSelectMode?"":'<div class="pp-add" id="addPP">+</div>'}
      </div>
      <div class="dialog-footer">
        <button class="btn ghost" data-edit>Edit details</button>
        <button class="btn" data-close>Done</button>
      </div>
    </div>
  `,document.body.appendChild(n),a&&(n.querySelector(".dialog").scrollTop=a),document.body.classList.add("no-scroll"),n.addEventListener("click",r=>{r.target===n&&(t.openPlaceId=null,document.body.classList.remove("no-scroll"),n.remove())}),n.querySelectorAll("[data-close]").forEach(r=>r.onclick=()=>{t.openPlaceId=null,document.body.classList.remove("no-scroll"),n.remove()}),n.querySelector("[data-edit]").onclick=()=>{t.isSelectMode=!1,t.selectedPhotos=[],document.body.classList.remove("no-scroll"),n.remove(),R(e)};let s=n.querySelector("#startPlaceSelect");s&&(s.onclick=()=>{let r=n.querySelector(".dialog").scrollTop;t.isSelectMode=!t.isSelectMode,t.selectedPhotos=[],n.remove(),A(r)});let i=n.querySelector("#bulkDeletePlaceBtn");i&&t.selectedPhotos.length>0&&(i.onclick=async()=>{if(await f(`Delete ${t.selectedPhotos.length} photos?`,{isConfirm:!0,isDanger:!0})){let r=[...c],u=t.selectedPhotos.filter(v=>v.startsWith("legacy-")).map(v=>parseInt(v.split("-")[1])).sort((v,g)=>g-v);u.forEach(v=>r.splice(v,1)),u.length>0&&Store.updatePlace(e.id,{photos:r}),t.selectedPhotos.filter(v=>!v.startsWith("legacy-")).forEach(v=>Store.removePhoto(v)),t.selectedPhotos=[],t.isSelectMode=!1,n.remove(),A()}});let p=n.querySelector("#addPP");p&&(p.onclick=()=>ee(e.id)),n.querySelectorAll(".pp").forEach(r=>{r.onclick=u=>{if(u.target.matches("[data-legacy-ppdel], [data-ppdel]"))return;let v=r.dataset.ppid||r.dataset.ppi;if(t.isSelectMode){let g=r.querySelector(".m-sel-check");t.selectedPhotos.includes(v)?(t.selectedPhotos=t.selectedPhotos.filter($=>$!==v),r.classList.remove("selected"),g&&(g.textContent="")):(t.selectedPhotos.push(v),r.classList.add("selected"),g&&(g.textContent="\u2713"))}else if(r.dataset.ppid){let g=Store.get().photos.find($=>$.id===r.dataset.ppid);g&&D(g)}else D({url:c[parseInt(r.dataset.ppi.split("-")[1])],caption:e.name,date:e.date})}})}function ee(a){let o=document.createElement("div");o.className="scrim",o.innerHTML=`
    <div class="dialog">
      <h2>Add a photo</h2>
      <div class="field"><label>Image URL</label><input id="purl"></div>
      <div class="field"><label>Or upload</label><input type="file" id="pfile" accept="image/*" multiple></div>
      <div class="dialog-actions">
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>Add</button>
      </div>
    </div>
  `,document.body.appendChild(o),o.querySelector("[data-cancel]").onclick=()=>o.remove(),o.querySelector("[data-save]").onclick=async()=>{let e=document.getElementById("purl").value.trim(),l=document.getElementById("pfile").files;if(!e&&l.length===0){alert("add a URL or select files first");return}let c=o.querySelector("[data-save]");c.textContent="Adding...",c.disabled=!0;try{let n=Store.get().places.find(s=>s.id===a);e&&Store.addPhoto({url:e,caption:n.name,date:n.date,placeId:n.id});for(let s=0;s<l.length;s++){let i=await P(l[s]);Store.addPhoto({url:i,caption:n.name,date:n.date,placeId:n.id})}o.remove(),y()}catch(n){alert(n.message),c.textContent="Add",c.disabled=!1}}}function R(a){let o=!!a,e=a||{name:"",note:"",lat:"",lng:"",date:new Date().toISOString().slice(0,10),photos:[]},l=document.createElement("div");l.className="scrim",l.innerHTML=`
    <div class="dialog">
      <h2>${o?"Edit place":"A new place"}</h2>
      <div class="field"><label>Name</label><input id="nname" value="${d(e.name)}"></div>
      <div class="field"><label>Date</label><input type="date" id="ndate" value="${d(e.date)}"></div>
      <div class="field"><label>Note</label><textarea id="nnote">${d(e.note)}</textarea></div>
      <div style="display:none"><input id="nlat" value="${d(e.lat)}"><input id="nlng" value="${d(e.lng)}"></div>
      <div class="field">
        <label>Location</label>
        <div style="display:flex;gap:8px;margin-bottom:8px"><input id="locSearch" style="flex:1"><button class="btn soft" id="locSearchBtn">Search</button></div>
        <div id="miniMap" style="height:220px;border-radius:8px;border:1px solid #d9dcd0"></div>
      </div>
      <div class="dialog-actions">
        ${o?'<button class="btn soft" data-del style="color:#a86060">Delete</button>':""}
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>Save</button>
      </div>
    </div>
  `,document.body.appendChild(l);let c;setTimeout(async()=>{await T();let n=document.getElementById("miniMap");if(!n)return;let s=parseFloat(e.lat)||20,i=parseFloat(e.lng)||0;c=L.map(n,{center:[s,i],zoom:e.lat?5:1,zoomControl:!1,attributionControl:!1}),n._leaflet_map=c,L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png").addTo(c);let p=L.marker([s,i]).addTo(c);c.on("click",r=>{let{lat:u,lng:v}=r.latlng;document.getElementById("nlat").value=u.toFixed(6),document.getElementById("nlng").value=v.toFixed(6),p?p.setLatLng([u,v]):p=L.marker([u,v]).addTo(c)})},50),l.querySelector("#locSearchBtn").onclick=async()=>{let n=document.getElementById("locSearch").value.trim();if(n)try{let i=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(n)}&limit=1`)).json();if(i&&i.length>0){let p=parseFloat(i[0].lat),r=parseFloat(i[0].lon);document.getElementById("nlat").value=p.toFixed(6),document.getElementById("nlng").value=r.toFixed(6),c&&(c.setView([p,r],5),L.marker([p,r]).addTo(c))}}catch{alert("Search failed")}},l.querySelector("[data-cancel]").onclick=()=>l.remove(),l.querySelector("[data-save]").onclick=async()=>{let n={name:document.getElementById("nname").value.trim(),note:document.getElementById("nnote").value.trim(),date:document.getElementById("ndate").value,lat:parseFloat(document.getElementById("nlat").value),lng:parseFloat(document.getElementById("nlng").value)};o?Store.updatePlace(e.id,n):Store.addPlace(n),l.remove(),t.openPlaceId=null,y()},o&&(l.querySelector("[data-del]").onclick=async()=>{await f("Delete this place?",{isConfirm:!0,isDanger:!0})&&(Store.removePlace(e.id),l.remove(),t.openPlaceId=null,y())})}async function _(){let o=Store.get().songs,e=o[0]||null;t.root.innerHTML=`
    ${x()}
    <div class="page">
      ${S("playlist")}
      <div class="playlist-header">
        <div class="eyebrow">Our Playlist</div>
        <h1 class="page-title">Songs of <em>us</em></h1>
      </div>
      <div class="playlist-main">
        ${e?`
          <div class="now-playing-card">
            <div class="player-cover-wrap"><img src="${d(e.cover)}" class="player-cover"><div class="vinyl-disc"></div></div>
            <div class="player-info"><h2>${d(e.title)}</h2><div class="artist">${d(e.artist)}</div></div>
            <div class="p-progress"><div class="p-bar"></div></div>
            <div class="player-controls">
              <button class="p-btn" id="skipBackBtn">${m("skipBack")}</button>
              <button class="p-btn main" id="playActive">${m("play")}</button>
              <button class="p-btn" id="skipForwardBtn">${m("skipForward")}</button>
            </div>
            <div class="vol-control">${m("volume")}<input type="range" id="volSlider" min="0" max="100" value="${t.ytVol}"></div>
            ${e.ytUrl?'<div id="yt-player-frame" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none"></div>':""}
          </div>
        `:'<div class="empty">No songs yet.</div>'}
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px">
            <h3 style="font-family:var(--serif); font-size:24px">Tracklist</h3>
            <button class="btn" id="addSongBtn">${m("plus")} Add song</button>
          </div>
          <div class="song-grid">
            ${o.map(n=>`
              <div class="song-card" data-sid="${d(n.id)}">
                <img src="${d(n.cover)}">
                <h4>${d(n.title)}</h4>
                <p>${d(n.artist)}</p>
                <button class="m-edit" data-sedit="${d(n.id)}">${m("edit")}</button>
                <button class="m-del" data-sdel="${d(n.id)}">\xD7</button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `,b();let l=document.getElementById("playActive");if(l&&((!t.ytPlayer||typeof t.ytPlayer.playVideo!="function")&&(l.style.opacity="0.5",l.style.cursor="wait"),l.onclick=()=>{if(Store.log("debug","Play button clicked",{hasPlayer:!!t.ytPlayer,ytState:t.ytState}),!t.ytPlayer||typeof t.ytPlayer.playVideo!="function"){Store.log("debug","Player not ready, setting autoPlayNext"),t.autoPlayNext=!0;return}t.ytState===1?(Store.log("debug","Pausing video"),t.ytPlayer.pauseVideo()):(Store.log("debug","Playing video"),t.ytPlayer.playVideo())}),e&&e.ytUrl)if(Store.log("debug","Loading YouTube API",{url:e.ytUrl}),await M(),window.YT&&window.YT.Player){let n=C(e.ytUrl);if(Store.log("debug","Parsed YouTube URL",n),n.id){if(t.ytPlayer){Store.log("debug","Destroying existing player");try{t.ytPlayer.destroy()}catch{}t.ytPlayer=null,t.ytState=-1}Store.log("debug","Creating new YT.Player",{videoId:n.id}),t.ytPlayer=new YT.Player("yt-player-frame",{height:"1px",width:"1px",videoId:n.id,host:"https://www.youtube.com",playerVars:{start:n.start,autoplay:t.autoPlayNext?1:0,origin:window.location.origin,enablejsapi:1},events:{onReady:s=>{Store.log("debug","Player onReady",{autoPlayNext:t.autoPlayNext}),l&&(l.style.opacity="1",l.style.cursor="pointer"),s.target.setVolume(t.ytVol),t.autoPlayNext&&(t.autoPlayNext=!1,s.target.playVideo())},onStateChange:s=>{Store.log("debug","Player onStateChange",{newState:s.data}),t.ytState=s.data;let i=document.querySelector(".player-cover-wrap");l&&(l.innerHTML=m(t.ytState===1?"pause":"play")),i&&i.classList.toggle("playing",t.ytState===1),t.ytState===0&&(Store.log("debug","Video ended, skipping to next"),document.getElementById("skipNextBtn").click())},onError:s=>{Store.log("error","YouTube Player Error",{errorCode:s.data})}}})}}else Store.log("error","YouTube API loaded but YT.Player not found");document.getElementById("skipBackBtn").onclick=()=>{o.length<2||(t.autoPlayNext=!1,Store.set(n=>{let s=n.songs.pop();n.songs.unshift(s)}),y())},document.getElementById("skipForwardBtn").onclick=()=>{o.length<2||(t.autoPlayNext=!1,Store.set(n=>{let s=n.songs.shift();n.songs.push(s)}),y())};let c=document.getElementById("volSlider");c&&(c.oninput=n=>{t.ytVol=parseInt(n.target.value),t.ytPlayer&&t.ytPlayer.setVolume&&t.ytPlayer.setVolume(t.ytVol)}),document.getElementById("addSongBtn").onclick=()=>Y(),document.querySelectorAll("[data-sedit]").forEach(n=>{n.onclick=s=>{s.stopPropagation();let i=o.find(p=>p.id===n.dataset.sedit);i&&Y(i)}}),document.querySelectorAll(".song-card").forEach(n=>{n.onclick=s=>{if(s.target.closest(".m-del")||s.target.closest(".m-edit"))return;let i=n.dataset.sid,p=o.find(r=>r.id===i);if(p){t.autoPlayNext=!1;let r=o.filter(u=>u.id!==i);Store.set(u=>{u.songs=[p,...r]}),y()}}}),document.querySelectorAll("[data-sdel]").forEach(n=>{n.onclick=async s=>{s.stopPropagation(),await f("Remove this song?",{isConfirm:!0,isDanger:!0})&&(Store.removeSong(n.dataset.sdel),y())}})}function Y(a=null){let o=!!a,e=document.createElement("div");e.className="scrim",e.innerHTML=`
    <div class="dialog">
      <h2>${o?"Edit Song":"Add to Playlist"}</h2>
      <div class="field"><label>Song Title</label><input type="text" id="stitle" value="${d(a?.title||"")}"></div>
      <div class="field"><label>Artist</label><input type="text" id="sartist" value="${d(a?.artist||"")}"></div>
      <div class="field"><label>YouTube Link</label><input type="text" id="syt" value="${d(a?.ytUrl||"")}"></div>
      <div class="field"><label>Cover Image</label><input type="file" id="scover" accept="image/*"></div>
      <div class="dialog-actions">
        <button class="btn ghost" onclick="this.closest('.scrim').remove()">Cancel</button>
        <button class="btn" id="saveSongBtn">${o?"Save Changes":"Add Song"}</button>
      </div>
    </div>
  `,document.body.appendChild(e),document.getElementById("saveSongBtn").onclick=async()=>{let l=document.getElementById("stitle").value,c=document.getElementById("sartist").value,n=document.getElementById("syt").value,s=document.getElementById("scover").files[0];if(!l||!c)return alert("Please enter title and artist");let i=document.getElementById("saveSongBtn");i.disabled=!0,i.textContent="Saving...";try{let p=a?a.cover:'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">\u{1F3B5}</text></svg>';s&&(p=await P(s));let r={title:l,artist:c,ytUrl:n,cover:p};o?Store.updateSong(a.id,r):Store.addSong(r),e.remove(),y()}catch{alert("Failed to process image"),i.disabled=!1}}}window.onerror=(a,o,e,l,c)=>{Store.log("error",a,{url:o,line:e,col:l,stack:c?c.stack:null})};window.onunhandledrejection=a=>{Store.log("promise_error",a.reason?a.reason.message:"unknown",{stack:a.reason?a.reason.stack:null})};function G(){let a=location.hash.replace("#/","")||"home",[o,...e]=a.split("/");return{path:o,params:e}}window.addEventListener("hashchange",y);function J(){let a=document.getElementById("skeletonLoader");a&&!a.classList.contains("hidden")&&(setTimeout(()=>a.classList.add("hidden"),500),setTimeout(()=>a.remove(),1e3))}async function y(){let a=G();if(Store.log("debug","Rendering route: "+a.path),U(),t.ytPlayer){try{t.ytPlayer.destroy()}catch{}t.ytPlayer=null,t.ytState=-1}if(document.querySelectorAll(".scrim").forEach(l=>l.remove()),!Store.get().session.unlocked){O(),J();return}switch(G().path){case"home":j();break;case"letters":H();break;case"gallery":k();break;case"map":await F();break;case"playlist":await _();break;default:location.hash="#/home"}J()}window.state=t;Store.init().then(()=>{y(),q()});})();
