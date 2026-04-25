(()=>{var t={root:document.getElementById("root"),adminOpen:!1,openLetter:null,openPlaceId:null,gallerySearch:"",ytPlayer:null,ytState:-1,ytVol:100,autoPlayNext:!1,selectedPhotos:[],isSelectMode:!1,worldGeoJSON:null,isIOS:/iPad|iPhone|iPod/.test(navigator.userAgent),devMode:localStorage.getItem("devMode")==="true",logs:[]};var E=null;function A(){return E||(E=new Promise((a,o)=>{if(window.L)return a();let e=document.createElement("link");e.rel="stylesheet",e.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(e);let l=document.createElement("script");l.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",l.onload=a,l.onerror=o,document.head.appendChild(l)}),E)}var M=null;function C(){return M||(M=new Promise(a=>{if(window.YT&&window.YT.Player)return a();let o=document.querySelector('script[src*="youtube.com/iframe_api"]'),e=()=>{window.YT&&window.YT.Player?a():setTimeout(e,100)};if(o)e();else{window.onYouTubeIframeAPIReady=()=>a();let l=document.createElement("script");l.src="https://www.youtube.com/iframe_api",document.head.appendChild(l)}}),M)}function U(){try{["map","miniMap"].forEach(a=>{let o=document.getElementById(a);if(o){if(window.echarts){let e=echarts.getInstanceByDom(o);e&&e.dispose()}o._leaflet_map&&(o._leaflet_map.remove(),delete o._leaflet_map)}})}catch{}}var X={heart:'<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',photo:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 17-5-5-9 9"/>',letter:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',map:'<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16M15 5v16"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',plus:'<path d="M12 5v14M5 12h14"/>',trash:'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',upload:'<path d="M12 21V9m-4 4 4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',play:'<path d="m5 3 14 9-14 9V3z"/>',pause:'<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',skipBack:'<path d="M19 20 9 12l10-8v16zM5 19V5"/>',skipForward:'<path d="m5 4 10 8-10 8V4zM19 5v14"/>',edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>'},v=a=>`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${X[a]}</svg>`;function i(a){return String(a??"").replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}function $(a){return a?new Date(a+(a.length===10?"T00:00:00":"")).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):""}function B(a){return a?new Date(a+(a.length===10?"T00:00:00":"")).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}):""}function h(a,{isConfirm:o=!1,isDanger:e=!1}={}){return document.activeElement&&document.activeElement.blur&&document.activeElement.blur(),new Promise(l=>{let d=document.createElement("div");d.className="scrim",d.style.zIndex="9999",d.innerHTML=`
      <div class="dialog" style="max-width:380px;text-align:center;padding:34px 24px;">
        <div class="leaf-decor" style="font-size:32px;margin-bottom:12px;opacity:0.8;">\u2766</div>
        <div class="dsub" style="font-size:17px;color:var(--ink);margin-bottom:28px;">${i(a)}</div>
        <div class="dialog-actions" style="justify-content:center;gap:12px">
          ${o?'<button class="btn ghost" data-c>Cancel</button>':""}
          <button class="btn" data-o style="${e?"background:#a86060;border-color:#a86060":""}">${o?e?"Delete":"Yes":"OK"}</button>
        </div>
      </div>
    `,document.body.appendChild(d);let s=p=>{d.remove(),l(p)},c=null;o&&(c=d.querySelector("[data-c]"),c.onclick=()=>s(!1));let n=d.querySelector("[data-o]");n.onclick=()=>s(!0),c||(c=n),setTimeout(()=>c.focus(),10)})}function O(a){let o=new Date(a+"T00:00:00"),e=new Date,l=e.getFullYear()-o.getFullYear(),d=e.getMonth()-o.getMonth(),s=e.getDate()-o.getDate();if(s<0){d--;let r=new Date(e.getFullYear(),e.getMonth(),0);s+=r.getDate()}d<0&&(l--,d+=12);let c=Math.floor((e-o)/(1e3*60*60*24)),n=new Date(e.getFullYear(),o.getMonth(),o.getDate());n<e&&n.setFullYear(e.getFullYear()+1);let p=Math.ceil((n-e)/(1e3*60*60*24));return{years:l,months:d,days:s,totalDays:c,daysUntilAnniv:p}}function D(a){let o="",e=0;try{let l=new URL(a);l.hostname==="youtu.be"?(o=l.pathname.slice(1),e=parseInt(l.searchParams.get("t"))||0):(o=l.searchParams.get("v"),e=parseInt(l.searchParams.get("t"))||0)}catch{let d=a.match(/v=([^&]+)/)||a.match(/embed\/([^?]+)/);d&&(o=d[1])}return{id:o,start:e}}function k(a,o=!1){return new Promise((e,l)=>{let d=/iPad|iPhone|iPod/.test(navigator.userAgent),s=d?1e3:1280,c=d?250*1024:400*1024,n=new Image,p=URL.createObjectURL(a);n.onload=()=>{URL.revokeObjectURL(p);let{width:r,height:m}=n;if(r>s||m>s){let P=Math.min(s/r,s/m);r=Math.round(r*P),m=Math.round(m*P)}let u=document.createElement("canvas");u.width=r,u.height=m;let g=u.getContext("2d");g.imageSmoothingEnabled=!0,g.imageSmoothingQuality="high",g.drawImage(n,0,0,r,m);let w=.85,q="image/jpeg";(()=>{if(o)u.toBlob(P=>e(P),q,w);else{let P=u.toDataURL(q,w);P.length>c&&w>.4&&(w-=.1,P=u.toDataURL(q,w)),e(P)}})()},n.onerror=()=>{URL.revokeObjectURL(p);let r=new FileReader;r.onload=()=>e(r.result),r.onerror=()=>l(r.error),r.readAsDataURL(a)},n.src=p})}function W(){let a=document.createElement("div");a.className="scrim",a.style.zIndex="3000",a.innerHTML=`
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
  `,document.body.appendChild(a),Store.getLogs(100).then(o=>{let e=document.getElementById("log-list");if(!o||o.length===0){e.innerHTML="No logs found in cloud.";return}e.innerHTML=o.map(l=>{let d=new Date(l.ts).toLocaleString();return`<div style="margin-bottom:12px; border-bottom:1px solid #222; padding-bottom:8px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px">
            <span style="color:${l.type==="error"||l.type==="promise_error"?"#ff6b6b":l.type==="debug"?"#4dabf7":"#a9e34b"}; font-weight:bold;">[${l.type.toUpperCase()}]</span>
            <span style="color:#666; font-size:11px;">${d}</span>
          </div>
          <div style="color:#fff; margin-bottom:4px">${i(l.msg)}</div>
          ${l.placeId?`<div style="color:#ffd43b">Place ID: ${l.placeId}</div>`:""}
          ${l.photoId?`<div style="color:#ffd43b">Photo ID: ${l.photoId}</div>`:""}
          ${l.stack?`<div style="color:#888; font-size:11px; background:#1a1a1a; padding:8px; border-radius:6px; margin:6px 0; overflow-x:auto;">${i(l.stack)}</div>`:""}
          <div style="color:#555; font-size:10px; margin-top:4px;">Device: ${i(l.ua)}</div>
        </div>`}).join("")}).catch(o=>{let e=document.getElementById("log-list");e&&(e.innerHTML="Failed to load logs: "+i(o.message))})}function f(){if(document.querySelectorAll(".drawer-scrim, .drawer").forEach(c=>c.remove()),!t.adminOpen)return;let a=Store.get(),o=document.createElement("div");o.className="drawer-scrim",o.style.cssText="position:fixed;inset:0;background:rgba(40,46,30,.35);backdrop-filter:blur(4px);z-index:89",document.body.appendChild(o);let e=document.createElement("div");e.className="drawer open",e.innerHTML=`
    <button class="closeX" data-close>\xD7</button>
    <h2>Garden settings</h2>
    <div class="ds">tend to the details of our little place</div>

    <div class="drawer-section">
      <h3>About us</h3>
      <div class="field"><label>Your name</label><input id="aname1" value="${i(a.couple.name1)}"></div>
      <div class="field"><label>Their name</label><input id="aname2" value="${i(a.couple.name2)}"></div>
      <div class="field"><label>Motto / subtitle</label><input id="amotto" value="${i(a.couple.motto)}"></div>
      <div class="field"><label>Anniversary (this is also your password)</label><input type="date" id="aanniv" value="${i(a.couple.anniversary)}"></div>
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
          <button class="btn soft" id="pushCloudBtn">${v("upload")} Push local to cloud</button>
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
        <button class="btn soft" id="exportBtn" style="flex:1; min-width:80px; justify-content:center; display:flex; align-items:center; gap:6px; font-size:14px;">${v("download")} Export</button>
        <button class="btn soft" id="logsBtn" style="flex:1; min-width:80px; justify-content:center; display:flex; align-items:center; gap:6px; font-size:14px;">${v("settings")} Logs</button>
        <label class="btn soft" style="flex:1; min-width:80px; cursor:pointer; justify-content:center; display:flex; align-items:center; gap:6px; font-size:14px;">
          ${v("upload")} Import<input type="file" id="importBtn" accept="application/json" style="display:none">
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
  `,document.body.appendChild(e),e.querySelector("#devToggle").onchange=c=>{t.devMode=c.target.checked,localStorage.setItem("devMode",t.devMode),N(),f()},o.onclick=()=>{t.adminOpen=!1,f()},e.querySelector("[data-close]").onclick=()=>{t.adminOpen=!1,f()},e.querySelector("#saveCouple").onclick=()=>{Store.setCouple({name1:document.getElementById("aname1").value.trim(),name2:document.getElementById("aname2").value.trim(),motto:document.getElementById("amotto").value.trim()||"our little garden",anniversary:document.getElementById("aanniv").value}),t.adminOpen=!1,f(),y()},e.querySelector("#exportBtn").onclick=()=>Store.exportJSON(),e.querySelector("#logsBtn").onclick=()=>{t.adminOpen=!1,f(),W()};let l=e.querySelector("#connectCloudBtn");l&&(l.onclick=()=>Q());let d=e.querySelector("#pushCloudBtn");d&&(d.onclick=()=>Store.pushLocalToCloud());let s=e.querySelector("#disconnectCloudBtn");s&&(s.onclick=async()=>{await h("Disconnect cloud sync? Local data stays.",{isConfirm:!0})&&(await Store.disconnectCloud(),t.adminOpen=!1,f(),setTimeout(()=>{t.adminOpen=!0,f()},50))}),e.querySelector("#importBtn").onchange=async c=>{let n=c.target.files[0];if(n)try{await Store.importJSON(n),alert("imported \u2661"),t.adminOpen=!1,f(),y()}catch(p){alert("import failed: "+p.message)}},e.querySelector("#resetBtn").onclick=async()=>{await h("Really clear everything? This cannot be undone.",{isConfirm:!0,isDanger:!0})&&(Store.resetAll(),t.adminOpen=!1,f(),location.hash="#/home",y())}}function Q(){let a=Store.cloud.config||{},o=document.createElement("div");o.className="scrim",o.innerHTML=`
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
  `,document.body.appendChild(o),o.querySelector("[data-cancel]").onclick=()=>o.remove(),o.querySelector("[data-connect]").onclick=async()=>{let e=document.getElementById("fbcfg").value.trim(),l;try{l=JSON.parse(e)}catch{try{let s=e.replace(/^\s*(const|let|var)\s+\w+\s*=\s*/,"").replace(/;?\s*$/,"");l=Function('"use strict";return('+s+")")()}catch{alert("invalid config format");return}}if(!l.apiKey||!l.projectId){alert("missing apiKey or projectId");return}await Store.connectCloud(l)&&(o.remove(),t.adminOpen=!1,f(),setTimeout(()=>{t.adminOpen=!0,f()},50),alert("Connected to cloud \u2661"))}}function N(){let a=document.getElementById("debug-panel");if(!t.devMode){a&&a.remove();return}a||(a=document.createElement("div"),a.id="debug-panel",a.style.cssText=`
      position:fixed; bottom:20px; right:20px; width:300px; height:200px;
      background:rgba(0,0,0,0.8); color:#0f0; font-family:monospace; font-size:10px;
      padding:10px; border-radius:10px; z-index:9999; overflow-y:auto;
      pointer-events:none; border:1px solid #0f0; box-shadow: 0 0 20px rgba(0,255,0,0.2);
    `,document.body.appendChild(a),window.addEventListener("sage-log",o=>{let e=o.detail,l=document.createElement("div");l.style.marginBottom="4px",l.textContent=`[${e.type}] ${e.msg}`,a.appendChild(l),a.scrollTop=a.scrollHeight})),a.innerHTML=t.logs.slice(0,50).reverse().map(o=>`<div>[${o.type}] ${o.msg}</div>`).join(""),a.scrollTop=a.scrollHeight}function b(){let a=document.getElementById("adminBtn");a&&(a.onclick=()=>{t.adminOpen=!t.adminOpen,f()});let o=document.getElementById("lockBtn");o&&(o.onclick=()=>{Store.lock(),y()})}function S(){let a=Store.get();return`
  <div class="topbar">
    <div class="brand">${i(a.couple.name1||"you")} <span class="brand-dot"></span> <em>${i(a.couple.name2||"me")}</em></div>
    <div class="topbar-right">
      <button class="icon-btn" id="adminBtn" title="Manage content">${v("settings")}</button>
      <button class="icon-btn" id="lockBtn" title="Lock">${v("lock")}</button>
    </div>
  </div>`}function x(a){return`<nav class="menu-nav">${[["home","Home"],["gallery","Gallery"],["letters","Love Notes"],["map","Our Map"],["playlist","Our Playlist"]].map(([e,l])=>`<a href="#/${e}" class="${a===e?"active":""}">${l}</a>`).join("")}</nav>`}function j(){t.root.innerHTML=`
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
      <div class="login-foot">EST. ${$(Store.get().couple.anniversary).toUpperCase()}</div>
    </div>
  </div>`,document.getElementById("loginForm").addEventListener("submit",a=>{a.preventDefault();let o=document.getElementById("pwd").value.replace(/\D/g,""),e=Store.get().couple.anniversary,[l,d,s]=e.split("-"),c=`${s}${d}${l}`,n=`${l}${d}${s}`,p=`${s}${d}${l.slice(2)}`;o===c||o===n||o===p?(Store.unlock(),location.hash="#/home",y()):(document.getElementById("err").textContent="not quite \u2014 try the date we began",document.getElementById("pwd").value="")})}function H(){let a=Store.get(),o=O(a.couple.anniversary);t.root.innerHTML=`
    ${S()}
    <div class="page">
      ${x("home")}
      <div class="home-hero">
        <div class="home-motto">${i(a.couple.motto)}</div>
        <h1 class="home-title">${i(a.couple.name1||"us")} <em>&amp;</em> ${i(a.couple.name2||"us")}</h1>
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
        ${a.songs.length>0?(()=>{let d=a.songs[Math.floor(Math.random()*a.songs.length)];return`
          <div class="home-playlist-card" id="homeSongCard" data-yt="${i(d.ytUrl||"")}">
            <div class="hp-vinyl" id="homeVinyl"><img src="${i(d.cover)}" class="hp-cover"></div>
            <div class="hp-info">
              <div class="label">Our song of the day</div>
              <div class="title">${i(d.title)}</div>
              <div class="artist">${i(d.artist)}</div>
            </div>
            <div class="hp-play-btn" style="font-size:24px; cursor:pointer; z-index:2" id="homePlayIcon">${v("play")}</div>
            <div id="home-yt-frame" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none"></div>
          </div>`})():""}
        <a href="#/gallery" class="q-card">
          <div class="qico">${v("photo")}</div>
          <h3>Our Gallery</h3>
          <div class="qc"><span>${a.photos.length} photos</span><span class="qarr">\u2192</span></div>
        </a>
        <a href="#/letters" class="q-card">
          <div class="qico">${v("letter")}</div>
          <h3>Love Notes</h3>
          <div class="qc"><span>${a.letters.length} letters</span><span class="qarr">\u2192</span></div>
        </a>
        <a href="#/map" class="q-card">
          <div class="qico">${v("map")}</div>
          <h3>Our Map</h3>
          <div class="qc"><span>${a.places.length} places</span><span class="qarr">\u2192</span></div>
        </a>
      </div>
    </div>
  `,b();let e=document.getElementById("homeSongCard"),l=document.getElementById("homePlayIcon");if(e&&l){let d=e.dataset.yt;if(d){let s=async()=>{if(t.ytPlayer||(l&&(l.style.opacity="0.5",l.style.cursor="wait"),await C(),!window.YT||!window.YT.Player))return;let c=D(d);c.id&&(t.ytPlayer=new YT.Player("home-yt-frame",{height:"1px",width:"1px",videoId:c.id,host:"https://www.youtube.com",playerVars:{start:c.start,autoplay:1,origin:window.location.origin},events:{onReady:n=>{l&&(l.style.opacity="1",l.style.cursor="pointer"),n.target.setVolume(t.ytVol),n.target.playVideo()},onStateChange:n=>{let p=n.data,r=document.getElementById("homeVinyl");l&&(l.innerHTML=v(p===1?"pause":"play")),r&&r.classList.toggle("playing",p===1)}}}))};l.onclick=c=>{if(c.stopPropagation(),!t.ytPlayer){s();return}t.ytPlayer.getPlayerState&&t.ytPlayer.getPlayerState()===1?t.ytPlayer.pauseVideo():t.ytPlayer.playVideo&&t.ytPlayer.playVideo()},e.onclick=c=>{c.target.closest("#homePlayIcon")||(location.hash="#/playlist")}}else e.onclick=()=>location.hash="#/playlist"}else e&&(e.onclick=()=>location.hash="#/playlist")}function I(){let a=Store.get(),o=t.gallerySearch.toLowerCase(),e=a.photos.filter(n=>!n.placeId&&(!o||(n.caption||"").toLowerCase().includes(o)||(n.date||"").includes(o)));t.root.innerHTML=`
    ${S()}
    <div class="page">
      ${x("gallery")}
      <div class="page-header" style="text-align:center">
        <div class="eyebrow">Our Gallery</div>
        <h1 class="page-title">Moments, <em>remembered</em></h1>
        <div class="page-sub">every quiet thing, kept</div>
      </div>
      <div class="gallery-toolbar">
        <div class="search-box">${v("search")}<input type="text" placeholder="search..." id="gsearch" value="${i(t.gallerySearch)}"></div>
        <div style="display:flex;gap:8px">
          ${t.isSelectMode?`<button class="btn soft" id="cancelSelect">Cancel</button><button class="btn" id="bulkDeleteBtn" style="background:#a86060;border-color:#a86060">${v("trash")} Delete (${t.selectedPhotos.length})</button>`:`<button class="btn soft" id="startSelect">${v("heart")} Select</button><button class="btn" id="addPhotoBtn">${v("plus")} Add photo</button>`}
        </div>
      </div>
      ${e.length===0?`<div class="empty"><span class="leaf">\u2766</span>${t.gallerySearch?"no moments match that":"no photos yet"}</div>`:`
        <div class="masonry ${t.isSelectMode?"select-mode":""}">
          ${e.map(n=>{let p=t.selectedPhotos.includes(n.id);return`
              <div class="m-item ${p?"selected":""}" data-photo="${i(n.id)}">
                ${n.url?`<img src="${i(n.url)}" alt="${i(n.caption||"")}" loading="lazy">`:'<div class="m-ph">photo placeholder</div>'}
                <div class="m-sel-check">${p?"\u2713":""}</div>
                ${t.isSelectMode?"":`<button class="m-del" data-del="${i(n.id)}" title="Remove">\xD7</button>`}
                ${n.caption||n.date?`<div class="mcap"><span>${i(n.caption||"")}</span><span class="mdate">${i($(n.date))}</span></div>`:""}
              </div>
            `}).join("")}
        </div>`}
    </div>
  `,b();let l=document.getElementById("addPhotoBtn");l&&(l.onclick=()=>Z());let d=document.getElementById("startSelect");d&&(d.onclick=()=>{t.isSelectMode=!0,t.selectedPhotos=[],I()});let s=document.getElementById("cancelSelect");s&&(s.onclick=()=>{t.isSelectMode=!1,t.selectedPhotos=[],I()});let c=document.getElementById("bulkDeleteBtn");c&&t.selectedPhotos.length>0&&(c.onclick=async()=>{await h(`Delete ${t.selectedPhotos.length} photos?`,{isConfirm:!0,isDanger:!0})&&(t.selectedPhotos.forEach(n=>Store.removePhoto(n)),t.selectedPhotos=[],t.isSelectMode=!1,I())}),document.getElementById("gsearch").oninput=n=>{t.gallerySearch=n.target.value,I()},t.root.querySelectorAll("[data-photo]").forEach(n=>{n.onclick=p=>{if(p.target.matches("[data-del]"))return;let r=n.dataset.photo;if(t.isSelectMode){let m=n.querySelector(".m-sel-check");t.selectedPhotos.includes(r)?(t.selectedPhotos=t.selectedPhotos.filter(g=>g!==r),n.classList.remove("selected"),m&&(m.textContent="")):(t.selectedPhotos.push(r),n.classList.add("selected"),m&&(m.textContent="\u2713"));let u=document.getElementById("bulkDeleteBtn");u&&(u.innerHTML=`${v("trash")} Delete (${t.selectedPhotos.length})`)}else{let m=Store.get().photos.find(u=>u.id===r);m&&T(m)}}}),t.root.querySelectorAll("[data-del]").forEach(n=>{n.onclick=async p=>{p.stopPropagation(),await h("Remove this photo?",{isConfirm:!0,isDanger:!0})&&(Store.removePhoto(n.dataset.del),I())}})}function Z(a){let o=!!a,e=a||{url:"",caption:"",date:new Date().toISOString().slice(0,10)},l=document.createElement("div");l.className="scrim",l.innerHTML=`
    <div class="dialog">
      <h2>${o?"Edit photo":"Add a memory"}</h2>
      <div class="field"><label>Image URL</label><input id="purl" value="${i(e.url)}"></div>
      <div class="field"><label>Or upload</label><input type="file" id="pfile" accept="image/*" multiple></div>
      <div class="field"><label>Caption</label><input id="pcap" value="${i(e.caption)}"></div>
      <div class="field"><label>Date</label><input type="date" id="pdate" value="${i(e.date)}"></div>
      <div class="dialog-actions">
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>Save</button>
      </div>
    </div>
  `,document.body.appendChild(l),document.body.classList.add("no-scroll"),l.querySelector("[data-cancel]").onclick=()=>{document.body.classList.remove("no-scroll"),l.remove()},l.querySelector("[data-save]").onclick=async()=>{let d=document.getElementById("purl").value.trim(),s=document.getElementById("pfile").files,c=document.getElementById("pcap").value.trim(),n=document.getElementById("pdate").value;if(!d&&s.length===0){alert("please add a URL or select files");return}let p=l.querySelector("[data-save]");p.textContent="Saving...",p.disabled=!0;try{if(o){let r=d;s.length>0&&(r=await k(s[0])),Store.updatePhoto(e.id,{url:r,caption:c,date:n})}else{d&&Store.addPhoto({url:d,caption:c,date:n});for(let r=0;r<s.length;r++){let m=await k(s[r]);Store.addPhoto({url:m,caption:c,date:n})}}document.body.classList.remove("no-scroll"),l.remove(),y()}catch(r){alert(r.message),p.textContent="Save",p.disabled=!1}}}function T(a){Store.log("debug","opening lightbox",{photoId:a.id}),document.body.classList.add("no-scroll");let o=document.createElement("div");o.className="lightbox",o.innerHTML=`
    <button class="lclose" aria-label="Close">\xD7</button>
    <button class="ldelete" aria-label="Delete">${v("trash")}</button>
    <img src="${i(a.url)}">
    ${a.caption||a.date?`<div class="lcap">${i(a.caption||"")}${a.caption&&a.date?" \xB7 ":""}${i(B(a.date))}</div>`:""}
  `,document.body.appendChild(o),o.addEventListener("click",e=>{(e.target===o||e.target.classList.contains("lclose"))&&(document.body.classList.remove("no-scroll"),o.remove())}),o.querySelector(".ldelete").onclick=async()=>{await h("Delete this memory?",{isConfirm:!0,isDanger:!0})&&(Store.removePhoto(a.id),document.body.classList.remove("no-scroll"),o.remove(),y())}}function V(){let a=Store.get();t.root.innerHTML=`
    ${S()}
    <div class="page">
      ${x("letters")}
      <div class="page-header" style="text-align:center">
        <div class="eyebrow">Love Notes</div>
        <h1 class="page-title">Letters, <em>for you</em></h1>
        <div class="page-sub">softly folded, kept in the drawer</div>
      </div>
      <div class="letters-grid">
        ${a.letters.map(o=>`
          <div class="envelope ${i(o.color||"peach")}" data-letter="${i(o.id)}">
            <div class="env-flap"></div>
            <div class="env-seal">\u2661</div>
            <div class="env-to">to ${i(o.to||"you")}</div>
            <div class="env-meta">
              <div class="env-date">${i($(o.date))}</div>
              <div class="env-title">${i(o.title||"a little note")}</div>
            </div>
          </div>
        `).join("")}
        <div class="envelope add" id="addLetterBtn">
          <div style="text-align:center"><span>+</span><div>write a new note</div></div>
        </div>
      </div>
      ${a.letters.length===0?'<div class="empty" style="grid-column:1/-1"><span class="leaf">\u2766</span>no letters yet</div>':""}
    </div>
  `,b(),document.getElementById("addLetterBtn").onclick=()=>R(),t.root.querySelectorAll("[data-letter]").forEach(o=>{o.onclick=()=>{t.openLetter=o.dataset.letter,y()}}),t.openLetter&&ee()}function ee(){let o=Store.get().letters.find(l=>l.id===t.openLetter);if(!o){t.openLetter=null;return}let e=document.createElement("div");e.className="scrim letter-scrim",e.innerHTML=`
    <div class="dialog" role="dialog">
      <div class="letter-head">
        <div class="ld">${i(B(o.date))}</div>
        <div class="ld">${i(o.from||"")}</div>
      </div>
      <div class="letter-to">Dear <em>${i(o.to||"you")}</em>,</div>
      <div class="letter-body">${i(o.body||"")}</div>
      <div class="letter-sign">\u2014 always, ${i(o.from||"yours")}</div>
      <div class="letter-actions">
        <button class="btn ghost" data-edit>Edit</button>
        <button class="btn soft" data-close>Close</button>
      </div>
    </div>
  `,document.body.appendChild(e),e.addEventListener("click",l=>{l.target===e&&(t.openLetter=null,e.remove())}),e.querySelector("[data-close]").onclick=()=>{t.openLetter=null,e.remove()},e.querySelector("[data-edit]").onclick=()=>{e.remove(),R(o)}}function R(a){let o=!!a,e=a||{from:Store.get().couple.name1||"",to:Store.get().couple.name2||"",title:"",body:"",color:"peach",date:new Date().toISOString().slice(0,10)},l=document.createElement("div");l.className="scrim",l.innerHTML=`
    <div class="dialog">
      <h2>${o?"Edit note":"A new note"}</h2>
      <div class="field"><label>Title</label><input id="ltitle" value="${i(e.title)}" placeholder="a little note"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="field"><label>From</label><input id="lfrom" value="${i(e.from)}"></div>
        <div class="field"><label>To</label><input id="lto" value="${i(e.to)}"></div>
      </div>
      <div class="field"><label>Date</label><input type="date" id="ldate" value="${i(e.date)}"></div>
      <div class="field"><label>Letter</label><textarea id="lbody" placeholder="write from the heart...">${i(e.body)}</textarea></div>
      <div class="field"><label>Envelope color</label>
        <div class="color-swatches" id="swatches">
          ${["peach","sage","blush","sand","lavender"].map(s=>`<div class="sw ${s} ${e.color===s?"active":""}" data-color="${s}"></div>`).join("")}
        </div>
      </div>
      <div class="dialog-actions">
        ${o?'<button class="btn soft" data-del style="margin-right:auto;color:#a86060">Delete</button>':""}
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>${o?"Save":"Seal it"}</button>
      </div>
    </div>
  `,document.body.appendChild(l);let d=e.color;l.querySelectorAll(".sw").forEach(s=>s.onclick=()=>{d=s.dataset.color,l.querySelectorAll(".sw").forEach(c=>c.classList.toggle("active",c===s))}),l.querySelector("[data-cancel]").onclick=()=>l.remove(),l.querySelector("[data-save]").onclick=()=>{let s={title:document.getElementById("ltitle").value.trim()||"a little note",from:document.getElementById("lfrom").value.trim(),to:document.getElementById("lto").value.trim(),date:document.getElementById("ldate").value,body:document.getElementById("lbody").value,color:d};o?Store.updateLetter(e.id,s):Store.addLetter(s),l.remove(),t.openLetter=null,y()},o&&(l.querySelector("[data-del]").onclick=async()=>{await h("Delete this note?",{isConfirm:!0,isDanger:!0})&&(Store.removeLetter(e.id),l.remove(),t.openLetter=null,y())})}async function F(){let a=Store.get();if(t.root.innerHTML=`
    ${S()}
    <div class="page">
      ${x("map")}
      <div class="page-header" style="text-align:center">
        <div class="eyebrow">Our Map</div>
        <h1 class="page-title">Places, <em>together</em></h1>
        <div class="page-sub">every pin, a story</div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
        <button class="btn" id="addPlaceBtn">${v("plus")} Add a place</button>
      </div>
      <div class="map-layout">
        <div id="map"></div>
        <div class="places-list">
          ${a.places.length===0?'<div class="empty" style="padding:40px 20px"><span class="leaf">\u2766</span>no places yet</div>':a.places.sort((n,p)=>new Date(p.date)-new Date(n.date)).map(n=>`
            <div class="place-item" data-place="${i(n.id)}">
              <h4>${i(n.name)}</h4>
              <div class="pd">${i($(n.date))}</div>
              <div class="pcount">${(n.photos||[]).length+a.photos.filter(p=>p.placeId===n.id).length} photos \u2192</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `,b(),document.getElementById("addPlaceBtn").onclick=()=>Y(),await A(),!window.L){t.root.querySelector("#map").innerHTML='<div class="empty"><span class="leaf">\u2766</span>Map failed to load.</div>';return}let o=document.getElementById("map");if(!o)return;let e=[59.91,10.75],l=L.map(o,{center:e,zoom:3,zoomControl:!1,attributionControl:!1});o._leaflet_map=l,L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{}).addTo(l);let d=[...a.places].sort((n,p)=>new Date(n.date)-new Date(p.date)).filter(n=>typeof n.lng=="number"&&typeof n.lat=="number"),s=L.divIcon({className:"custom-marker",html:`
      <div class="pin-wrap">
        <div class="pin-circle"></div>
        <div class="pin-glow"></div>
      </div>
    `,iconSize:[24,24],iconAnchor:[12,12]}),c=[];if(d.forEach(n=>{let p=L.marker([n.lat,n.lng],{icon:s}).addTo(l);p.on("click",()=>{t.openPlaceId=n.id,y()}),p.bindTooltip(`
      <div class="map-tooltip">
        <div class="mt-title">${i(n.name)}</div>
        <div class="mt-date">${$(n.date)}</div>
      </div>`,{direction:"top",offset:[0,-10],opacity:1,className:"premium-tooltip"}),Math.sqrt(Math.pow(n.lat-e[0],2)+Math.pow(n.lng-e[1],2))>.5&&L.polyline([e,[n.lat,n.lng]],{color:"var(--sage)",weight:1.5,opacity:.25,dashArray:"6, 12",smoothFactor:2}).addTo(l),c.push(p)}),L.marker(e,{icon:L.divIcon({className:"home-marker-premium",html:`
        <div class="home-pin">
          <div class="home-icon">${v("heart")}</div>
          <div class="home-glow"></div>
        </div>
      `,iconSize:[36,36],iconAnchor:[18,18]})}).addTo(l).bindTooltip("Home",{direction:"top",className:"premium-tooltip"}),c.length>0){let n=new L.featureGroup([...c,L.marker(e)]);l.fitBounds(n.getBounds().pad(.2))}t.root.querySelectorAll(".place-item").forEach(n=>{n.onclick=()=>{t.openPlaceId=n.dataset.place,y()}}),t.openPlaceId&&z()}function z(a=0){let o=Store.get(),e=o.places.find(r=>r.id===t.openPlaceId);if(!e){t.openPlaceId=null;return}let l=o.photos.filter(r=>r.placeId===e.id),d=e.photos||[],s=document.createElement("div");s.className="scrim",s.innerHTML=`
    <div class="dialog" style="max-width:680px">
      <div class="dialog-header">
        <div class="header-left">
          <div class="eyebrow">${i(B(e.date))}</div>
          <h2 style="margin:0">${i(e.name)}</h2>
        </div>
        <div style="display:flex;gap:8px">
          ${t.isSelectMode?`
            <button class="btn" id="bulkDeletePlaceBtn" style="background:#a86060">${v("trash")} Delete (${t.selectedPhotos.length})</button>
            <button class="btn soft" id="startPlaceSelect">Cancel</button>
          `:`
            <button class="btn soft" id="startPlaceSelect">${v("heart")} Select</button>
            <button class="icon-btn close-dialog" data-close>\xD7</button>
          `}
        </div>
      </div>
      ${e.note?`<div class="place-note">${i(e.note)}</div>`:""}
      <div class="place-photos ${t.isSelectMode?"select-mode":""}">
        ${d.map((r,m)=>{let u=`legacy-${m}`,g=t.selectedPhotos.includes(u);return`<div class="pp ${g?"selected":""}" data-ppi="${u}"><img src="${i(r)}" loading="lazy"><div class="m-sel-check">${g?"\u2713":""}</div>${t.isSelectMode?"":`<button class="m-del" data-legacy-ppdel="${m}">\xD7</button>`}</div>`}).join("")}
        ${l.map(r=>{let m=t.selectedPhotos.includes(r.id);return`<div class="pp ${m?"selected":""}" data-ppid="${i(r.id)}"><img src="${i(r.url)}" loading="lazy"><div class="m-sel-check">${m?"\u2713":""}</div>${t.isSelectMode?"":`<button class="m-del" data-ppdel="${i(r.id)}">\xD7</button>`}</div>`}).join("")}
        ${t.isSelectMode?"":'<div class="pp-add" id="addPP">+</div>'}
      </div>
      <div class="dialog-footer">
        <button class="btn ghost" data-edit>Edit details</button>
        <button class="btn" data-close>Done</button>
      </div>
    </div>
  `,document.body.appendChild(s),a&&(s.querySelector(".dialog").scrollTop=a),document.body.classList.add("no-scroll"),s.addEventListener("click",r=>{r.target===s&&(t.openPlaceId=null,document.body.classList.remove("no-scroll"),s.remove())}),s.querySelectorAll("[data-close]").forEach(r=>r.onclick=()=>{t.openPlaceId=null,document.body.classList.remove("no-scroll"),s.remove()}),s.querySelector("[data-edit]").onclick=()=>{t.isSelectMode=!1,t.selectedPhotos=[],document.body.classList.remove("no-scroll"),s.remove(),Y(e)};let c=s.querySelector("#startPlaceSelect");c&&(c.onclick=()=>{let r=s.querySelector(".dialog").scrollTop;t.isSelectMode=!t.isSelectMode,t.selectedPhotos=[],s.remove(),z(r)});let n=s.querySelector("#bulkDeletePlaceBtn");n&&t.selectedPhotos.length>0&&(n.onclick=async()=>{if(await h(`Delete ${t.selectedPhotos.length} photos?`,{isConfirm:!0,isDanger:!0})){let r=[...d],m=t.selectedPhotos.filter(u=>u.startsWith("legacy-")).map(u=>parseInt(u.split("-")[1])).sort((u,g)=>g-u);m.forEach(u=>r.splice(u,1)),m.length>0&&Store.updatePlace(e.id,{photos:r}),t.selectedPhotos.filter(u=>!u.startsWith("legacy-")).forEach(u=>Store.removePhoto(u)),t.selectedPhotos=[],t.isSelectMode=!1,s.remove(),z()}});let p=s.querySelector("#addPP");p&&(p.onclick=()=>te(e.id)),s.querySelectorAll(".pp").forEach(r=>{r.onclick=m=>{if(m.target.matches("[data-legacy-ppdel], [data-ppdel]"))return;let u=r.dataset.ppid||r.dataset.ppi;if(t.isSelectMode){let g=r.querySelector(".m-sel-check");t.selectedPhotos.includes(u)?(t.selectedPhotos=t.selectedPhotos.filter(w=>w!==u),r.classList.remove("selected"),g&&(g.textContent="")):(t.selectedPhotos.push(u),r.classList.add("selected"),g&&(g.textContent="\u2713"))}else if(r.dataset.ppid){let g=Store.get().photos.find(w=>w.id===r.dataset.ppid);g&&T(g)}else T({url:d[parseInt(r.dataset.ppi.split("-")[1])],caption:e.name,date:e.date})}})}function te(a){let o=document.createElement("div");o.className="scrim",o.innerHTML=`
    <div class="dialog">
      <h2>Add a photo</h2>
      <div class="field"><label>Image URL</label><input id="purl"></div>
      <div class="field"><label>Or upload</label><input type="file" id="pfile" accept="image/*" multiple></div>
      <div class="dialog-actions">
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>Add</button>
      </div>
    </div>
  `,document.body.appendChild(o),o.querySelector("[data-cancel]").onclick=()=>o.remove(),o.querySelector("[data-save]").onclick=async()=>{let e=document.getElementById("purl").value.trim(),l=document.getElementById("pfile").files;if(!e&&l.length===0){alert("add a URL or select files first");return}let d=o.querySelector("[data-save]");d.textContent="Adding...",d.disabled=!0;try{let s=Store.get().places.find(c=>c.id===a);e&&Store.addPhoto({url:e,caption:s.name,date:s.date,placeId:s.id});for(let c=0;c<l.length;c++){let n=await k(l[c]);Store.addPhoto({url:n,caption:s.name,date:s.date,placeId:s.id})}o.remove(),y()}catch(s){alert(s.message),d.textContent="Add",d.disabled=!1}}}function Y(a){let o=!!a,e=a||{name:"",note:"",lat:"",lng:"",date:new Date().toISOString().slice(0,10),photos:[]},l=document.createElement("div");l.className="scrim",l.innerHTML=`
    <div class="dialog">
      <h2>${o?"Edit place":"A new place"}</h2>
      <div class="field"><label>Name</label><input id="nname" value="${i(e.name)}"></div>
      <div class="field"><label>Date</label><input type="date" id="ndate" value="${i(e.date)}"></div>
      <div class="field"><label>Note</label><textarea id="nnote">${i(e.note)}</textarea></div>
      <div style="display:none"><input id="nlat" value="${i(e.lat)}"><input id="nlng" value="${i(e.lng)}"></div>
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
  `,document.body.appendChild(l);let d;setTimeout(async()=>{await A();let s=document.getElementById("miniMap");if(!s)return;let c=parseFloat(e.lat)||20,n=parseFloat(e.lng)||0;d=L.map(s,{center:[c,n],zoom:e.lat?5:1,zoomControl:!1,attributionControl:!1}),s._leaflet_map=d,L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png").addTo(d);let p=L.marker([c,n],{icon:L.divIcon({className:"custom-marker small",html:'<div class="pin-wrap"><div class="pin-circle"></div></div>',iconSize:[16,16],iconAnchor:[8,8]})}).addTo(d);d.on("click",r=>{let{lat:m,lng:u}=r.latlng;document.getElementById("nlat").value=m.toFixed(6),document.getElementById("nlng").value=u.toFixed(6),p?p.setLatLng([m,u]):p=L.marker([m,u],{icon:L.divIcon({className:"custom-marker small",html:'<div class="pin-wrap"><div class="pin-circle"></div></div>',iconSize:[16,16],iconAnchor:[8,8]})}).addTo(d)})},50),l.querySelector("#locSearchBtn").onclick=async()=>{let s=document.getElementById("locSearch").value.trim();if(s)try{let n=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(s)}&limit=1`)).json();if(n&&n.length>0){let p=parseFloat(n[0].lat),r=parseFloat(n[0].lon);document.getElementById("nlat").value=p.toFixed(6),document.getElementById("nlng").value=r.toFixed(6),d&&(d.setView([p,r],5),L.marker([p,r]).addTo(d))}}catch{alert("Search failed")}},l.querySelector("[data-cancel]").onclick=()=>l.remove(),l.querySelector("[data-save]").onclick=async()=>{let s={name:document.getElementById("nname").value.trim(),note:document.getElementById("nnote").value.trim(),date:document.getElementById("ndate").value,lat:parseFloat(document.getElementById("nlat").value),lng:parseFloat(document.getElementById("nlng").value)};o?Store.updatePlace(e.id,s):Store.addPlace(s),l.remove(),t.openPlaceId=null,y()},o&&(l.querySelector("[data-del]").onclick=async()=>{await h("Delete this place?",{isConfirm:!0,isDanger:!0})&&(Store.removePlace(e.id),l.remove(),t.openPlaceId=null,y())})}async function G(){let o=Store.get().songs,e=o[0]||null;t.root.innerHTML=`
    ${S()}
    <div class="page">
      ${x("playlist")}
      <div class="playlist-header">
        <div class="eyebrow">Our Playlist</div>
        <h1 class="page-title">Songs of <em>us</em></h1>
      </div>
      <div class="playlist-main">
        ${e?`
          <div class="now-playing-card">
            <div class="player-cover-wrap"><img src="${i(e.cover)}" class="player-cover"><div class="vinyl-disc"></div></div>
            <div class="player-info"><h2>${i(e.title)}</h2><div class="artist">${i(e.artist)}</div></div>
            <div class="p-progress"><div class="p-bar"></div></div>
            <div class="player-controls">
              <button class="p-btn" id="skipBackBtn">${v("skipBack")}</button>
              <button class="p-btn main" id="playActive">${v("play")}</button>
              <button class="p-btn" id="skipForwardBtn">${v("skipForward")}</button>
            </div>
            <div class="vol-control">${v("volume")}<input type="range" id="volSlider" min="0" max="100" value="${t.ytVol}"></div>
            ${e.ytUrl?'<div id="yt-player-frame" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none"></div>':""}
          </div>
        `:'<div class="empty">No songs yet.</div>'}
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px">
            <h3 style="font-family:var(--serif); font-size:24px">Tracklist</h3>
            <button class="btn" id="addSongBtn">${v("plus")} Add song</button>
          </div>
          <div class="song-grid">
            ${o.map(s=>`
              <div class="song-card" data-sid="${i(s.id)}">
                <img src="${i(s.cover)}">
                <h4>${i(s.title)}</h4>
                <p>${i(s.artist)}</p>
                <button class="m-edit" data-sedit="${i(s.id)}">${v("edit")}</button>
                <button class="m-del" data-sdel="${i(s.id)}">\xD7</button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `,b();let l=document.getElementById("playActive");if(l&&((!t.ytPlayer||typeof t.ytPlayer.playVideo!="function")&&(l.style.opacity="0.5",l.style.cursor="wait"),l.onclick=()=>{if(Store.log("debug","Play button clicked",{hasPlayer:!!t.ytPlayer,ytState:t.ytState}),!t.ytPlayer||typeof t.ytPlayer.playVideo!="function"){Store.log("debug","Player not ready, setting autoPlayNext"),t.autoPlayNext=!0;return}t.ytState===1?(Store.log("debug","Pausing video"),t.ytPlayer.pauseVideo()):(Store.log("debug","Playing video"),t.ytPlayer.playVideo())}),e&&e.ytUrl)if(Store.log("debug","Loading YouTube API",{url:e.ytUrl}),await C(),window.YT&&window.YT.Player){let s=D(e.ytUrl);if(Store.log("debug","Parsed YouTube URL",s),s.id){if(t.ytPlayer){Store.log("debug","Destroying existing player");try{t.ytPlayer.destroy()}catch{}t.ytPlayer=null,t.ytState=-1}Store.log("debug","Creating new YT.Player",{videoId:s.id}),t.ytPlayer=new YT.Player("yt-player-frame",{height:"1px",width:"1px",videoId:s.id,host:"https://www.youtube.com",playerVars:{start:s.start,autoplay:t.autoPlayNext?1:0,origin:window.location.origin,enablejsapi:1},events:{onReady:c=>{Store.log("debug","Player onReady",{autoPlayNext:t.autoPlayNext}),l&&(l.style.opacity="1",l.style.cursor="pointer"),c.target.setVolume(t.ytVol),t.autoPlayNext&&(t.autoPlayNext=!1,c.target.playVideo())},onStateChange:c=>{Store.log("debug","Player onStateChange",{newState:c.data}),t.ytState=c.data;let n=document.querySelector(".player-cover-wrap");l&&(l.innerHTML=v(t.ytState===1?"pause":"play")),n&&n.classList.toggle("playing",t.ytState===1),t.ytState===0&&(Store.log("debug","Video ended, skipping to next"),document.getElementById("skipNextBtn").click())},onError:c=>{Store.log("error","YouTube Player Error",{errorCode:c.data})}}})}}else Store.log("error","YouTube API loaded but YT.Player not found");document.getElementById("skipBackBtn").onclick=()=>{o.length<2||(t.autoPlayNext=!1,Store.set(s=>{let c=s.songs.pop();s.songs.unshift(c)}),y())},document.getElementById("skipForwardBtn").onclick=()=>{o.length<2||(t.autoPlayNext=!1,Store.set(s=>{let c=s.songs.shift();s.songs.push(c)}),y())};let d=document.getElementById("volSlider");d&&(d.oninput=s=>{t.ytVol=parseInt(s.target.value),t.ytPlayer&&t.ytPlayer.setVolume&&t.ytPlayer.setVolume(t.ytVol)}),document.getElementById("addSongBtn").onclick=()=>_(),document.querySelectorAll("[data-sedit]").forEach(s=>{s.onclick=c=>{c.stopPropagation();let n=o.find(p=>p.id===s.dataset.sedit);n&&_(n)}}),document.querySelectorAll(".song-card").forEach(s=>{s.onclick=c=>{if(c.target.closest(".m-del")||c.target.closest(".m-edit"))return;let n=s.dataset.sid,p=o.find(r=>r.id===n);if(p){t.autoPlayNext=!1;let r=o.filter(m=>m.id!==n);Store.set(m=>{m.songs=[p,...r]}),y()}}}),document.querySelectorAll("[data-sdel]").forEach(s=>{s.onclick=async c=>{c.stopPropagation(),await h("Remove this song?",{isConfirm:!0,isDanger:!0})&&(Store.removeSong(s.dataset.sdel),y())}})}function _(a=null){let o=!!a,e=document.createElement("div");e.className="scrim",e.innerHTML=`
    <div class="dialog">
      <h2>${o?"Edit Song":"Add to Playlist"}</h2>
      <div class="field"><label>Song Title</label><input type="text" id="stitle" value="${i(a?.title||"")}"></div>
      <div class="field"><label>Artist</label><input type="text" id="sartist" value="${i(a?.artist||"")}"></div>
      <div class="field"><label>YouTube Link</label><input type="text" id="syt" value="${i(a?.ytUrl||"")}"></div>
      <div class="field"><label>Cover Image</label><input type="file" id="scover" accept="image/*"></div>
      <div class="dialog-actions">
        <button class="btn ghost" onclick="this.closest('.scrim').remove()">Cancel</button>
        <button class="btn" id="saveSongBtn">${o?"Save Changes":"Add Song"}</button>
      </div>
    </div>
  `,document.body.appendChild(e),document.getElementById("saveSongBtn").onclick=async()=>{let l=document.getElementById("stitle").value,d=document.getElementById("sartist").value,s=document.getElementById("syt").value,c=document.getElementById("scover").files[0];if(!l||!d)return alert("Please enter title and artist");let n=document.getElementById("saveSongBtn");n.disabled=!0,n.textContent="Saving...";try{let p=a?a.cover:'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">\u{1F3B5}</text></svg>';c&&(p=await k(c));let r={title:l,artist:d,ytUrl:s,cover:p};o?Store.updateSong(a.id,r):Store.addSong(r),e.remove(),y()}catch{alert("Failed to process image"),n.disabled=!1}}}window.onerror=(a,o,e,l,d)=>{Store.log("error",a,{url:o,line:e,col:l,stack:d?d.stack:null})};window.onunhandledrejection=a=>{Store.log("promise_error",a.reason?a.reason.message:"unknown",{stack:a.reason?a.reason.stack:null})};function J(){let a=location.hash.replace("#/","")||"home",[o,...e]=a.split("/");return{path:o,params:e}}window.addEventListener("hashchange",y);function K(){let a=document.getElementById("skeletonLoader");a&&!a.classList.contains("hidden")&&(setTimeout(()=>a.classList.add("hidden"),500),setTimeout(()=>a.remove(),1e3))}async function y(){let a=J();if(Store.log("debug","Rendering route: "+a.path),U(),t.ytPlayer){try{t.ytPlayer.destroy()}catch{}t.ytPlayer=null,t.ytState=-1}if(document.querySelectorAll(".scrim").forEach(l=>l.remove()),!Store.get().session.unlocked){j(),K();return}switch(J().path){case"home":H();break;case"letters":V();break;case"gallery":I();break;case"map":await F();break;case"playlist":await G();break;default:location.hash="#/home"}K()}window.state=t;Store.init().then(()=>{y(),N()});})();
