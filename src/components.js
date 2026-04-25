import { state } from "./state.js";
import { esc, icon, customDialog } from "./utils.js";
import { render } from "./main.js";
import { openLetterEditor } from "./pages/letters.js";
import { openPhotoEditor } from "./pages/gallery.js";
import { openPlaceEditor } from "./pages/map.js";
import { openSongEditor } from "./pages/playlist.js";

export function showLogsDialog() {
  const scrim = document.createElement("div");
  scrim.className = "scrim";
  scrim.style.zIndex = "3000";
  scrim.innerHTML = `
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
  `;
  document.body.appendChild(scrim);

  Store.getLogs(100).then((logs) => {
    const list = document.getElementById("log-list");
    if (!logs || logs.length === 0) {
      list.innerHTML = "No logs found in cloud.";
      return;
    }
    list.innerHTML = logs
      .map((l) => {
        const time = new Date(l.ts).toLocaleString();
        const color =
          l.type === "error" || l.type === "promise_error"
            ? "#ff6b6b"
            : l.type === "debug"
              ? "#4dabf7"
              : "#a9e34b";
        return `<div style="margin-bottom:12px; border-bottom:1px solid #222; padding-bottom:8px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px">
          <span style="color:${color}; font-weight:bold;">[${l.type.toUpperCase()}]</span>
          <span style="color:#666; font-size:11px;">${time}</span>
        </div>
        <div style="color:#fff; margin-bottom:4px">${esc(l.msg)}</div>
        ${l.placeId ? `<div style="color:#ffd43b">Place ID: ${l.placeId}</div>` : ""}
        ${l.photoId ? `<div style="color:#ffd43b">Photo ID: ${l.photoId}</div>` : ""}
        ${l.stack ? `<div style="color:#888; font-size:11px; background:#1a1a1a; padding:8px; border-radius:6px; margin:6px 0; overflow-x:auto;">${esc(l.stack)}</div>` : ""}
        <div style="color:#555; font-size:10px; margin-top:4px;">Device: ${esc(l.ua)}</div>
      </div>`;
      })
      .join("");
  });
}

export function renderAdminDrawer() {
  document
    .querySelectorAll(".drawer-scrim, .drawer")
    .forEach((el) => el.remove());
  if (!state.adminOpen) return;
  const d = Store.get();
  const scrim = document.createElement("div");
  scrim.className = "drawer-scrim";
  scrim.style.cssText =
    "position:fixed;inset:0;background:rgba(40,46,30,.35);backdrop-filter:blur(4px);z-index:89";
  document.body.appendChild(scrim);

  const drawer = document.createElement("div");
  drawer.className = "drawer open";
  drawer.innerHTML = `
    <button class="closeX" data-close>×</button>
    <h2>Garden settings</h2>
    <div class="ds">tend to the details of our little place</div>

    <div class="drawer-section">
      <h3>About us</h3>
      <div class="field"><label>Your name</label><input id="aname1" value="${esc(d.couple.name1)}"></div>
      <div class="field"><label>Their name</label><input id="aname2" value="${esc(d.couple.name2)}"></div>
      <div class="field"><label>Motto / subtitle</label><input id="amotto" value="${esc(d.couple.motto)}"></div>
      <div class="field"><label>Anniversary (this is also your password)</label><input type="date" id="aanniv" value="${esc(d.couple.anniversary)}"></div>
      <button class="btn" id="saveCouple">Save</button>
    </div>

    <div class="drawer-section" style="background:${Store.cloud.connected ? "#eaf0e0" : "#faf6ed"}">
      <h3>☁ Cloud Sync (Firebase) ${Store.cloud.connected ? '<span style="font-size:12px;color:var(--sage);font-style:italic;font-weight:400">· connected</span>' : ""}</h3>
      <p style="font-family:var(--serif);font-style:italic;color:var(--ink-soft);font-size:14px;margin-bottom:12px;line-height:1.5">
        ${Store.cloud.connected ? "data syncs automatically across all devices. both of you see updates in realtime." : "free · syncs data between you & your partner automatically. see setup guide in FIREBASE_SETUP.md"}
      </p>
      ${
        Store.cloud.connected
          ? `
        <div class="drawer-actions">
          <button class="btn soft" id="pushCloudBtn">${icon("upload")} Push local to cloud</button>
          <button class="btn soft" id="disconnectCloudBtn" style="color:#a86060">Disconnect</button>
        </div>
      `
          : `
        <button class="btn" id="connectCloudBtn">Connect to Firebase</button>
      `
      }
    </div>

    <div class="drawer-section">
      <h3>Back up &amp; restore</h3>
      <div class="drawer-actions">
        <button class="btn soft" id="exportBtn" style="flex:1">${icon("download")} Export</button>
        <button class="btn soft" id="logsBtn" style="flex:1">${icon("settings")} Logs</button>
        <label class="btn soft" style="cursor:pointer; flex:1">${icon("upload")} Import<input type="file" id="importBtn" accept="application/json" style="display:none"></label>
      </div>
    </div>

    <div class="drawer-section">
      <h3>Quick add</h3>
      <div class="drawer-actions">
        <button class="btn soft" data-quick="letter">${icon("letter")} Write note</button>
        <button class="btn soft" data-quick="photo">${icon("photo")} Add photo</button>
        <button class="btn soft" data-quick="place">${icon("map")} Add place</button>
        <button class="btn soft" data-quick="song">${icon("music")} Add song</button>
      </div>
    </div>

    <div class="drawer-section" style="background:#f6ecea;border-color:#e4cfcb">
      <h3 style="color:#a86060">Danger</h3>
      <button class="btn soft" id="resetBtn" style="color:#a86060;border-color:#d9b4ae">Reset everything</button>
    </div>
  `;
  document.body.appendChild(drawer);
  scrim.onclick = () => {
    state.adminOpen = false;
    renderAdminDrawer();
  };
  drawer.querySelector("[data-close]").onclick = () => {
    state.adminOpen = false;
    renderAdminDrawer();
  };

  drawer.querySelector("#saveCouple").onclick = () => {
    Store.setCouple({
      name1: document.getElementById("aname1").value.trim(),
      name2: document.getElementById("aname2").value.trim(),
      motto:
        document.getElementById("amotto").value.trim() || "our little garden",
      anniversary: document.getElementById("aanniv").value,
    });
    state.adminOpen = false;
    renderAdminDrawer();
    render();
  };

  drawer.querySelector("#exportBtn").onclick = () => Store.exportJSON();
  drawer.querySelector("#logsBtn").onclick = () => {
    state.adminOpen = false;
    renderAdminDrawer();
    showLogsDialog();
  };
  const connectBtn = drawer.querySelector("#connectCloudBtn");
  if (connectBtn) connectBtn.onclick = () => openFirebaseConnect();
  const pushBtn = drawer.querySelector("#pushCloudBtn");
  if (pushBtn) pushBtn.onclick = () => Store.pushLocalToCloud();
  const disBtn = drawer.querySelector("#disconnectCloudBtn");
  if (disBtn)
    disBtn.onclick = async () => {
      if (
        await customDialog("Disconnect cloud sync? Local data stays.", {
          isConfirm: true,
        })
      ) {
        await Store.disconnectCloud();
        state.adminOpen = false;
        renderAdminDrawer();
        setTimeout(() => {
          state.adminOpen = true;
          renderAdminDrawer();
        }, 50);
      }
    };
  drawer.querySelector("#importBtn").onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      await Store.importJSON(f);
      alert("imported ♡");
      state.adminOpen = false;
      renderAdminDrawer();
      render();
    } catch (err) {
      alert("import failed: " + err.message);
    }
  };
  drawer.querySelector("#resetBtn").onclick = async () => {
    if (
      await customDialog("Really clear everything? This cannot be undone.", {
        isConfirm: true,
        isDanger: true,
      })
    ) {
      Store.resetAll();
      state.adminOpen = false;
      renderAdminDrawer();
      location.hash = "#/home";
      render();
    }
  };
  drawer.querySelectorAll("[data-quick]").forEach((b) => {
    b.onclick = () => {
      state.adminOpen = false;
      renderAdminDrawer();
      if (b.dataset.quick === "letter") openLetterEditor();
      if (b.dataset.quick === "photo") openPhotoEditor();
      if (b.dataset.quick === "place") openPlaceEditor();
      if (b.dataset.quick === "song") openSongEditor();
    };
  });
}

export function openFirebaseConnect() {
  const existing = Store.cloud.config || {};
  const scrim = document.createElement("div");
  scrim.className = "scrim";
  scrim.innerHTML = `
    <div class="dialog" style="max-width:560px">
      <h2>Connect to Firebase</h2>
      <div class="dsub">paste your firebaseConfig from the Firebase console</div>
      <div class="field">
        <label>firebaseConfig (paste the whole object)</label>
        <textarea id="fbcfg" style="font-family:monospace;font-size:13px;min-height:180px" placeholder='{ "apiKey": "...", "projectId": "...", ... }'>${existing.apiKey ? JSON.stringify(existing, null, 2) : ""}</textarea>
      </div>
      <div class="dialog-actions">
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-connect>Connect</button>
      </div>
    </div>
  `;
  document.body.appendChild(scrim);
  scrim.querySelector("[data-cancel]").onclick = () => scrim.remove();
  scrim.querySelector("[data-connect]").onclick = async () => {
    const raw = document.getElementById("fbcfg").value.trim();
    let cfg;
    try {
      cfg = JSON.parse(raw);
    } catch {
      try {
        const cleaned = raw
          .replace(/^\s*(const|let|var)\s+\w+\s*=\s*/, "")
          .replace(/;?\s*$/, "");
        cfg = Function('"use strict";return(' + cleaned + ")")();
      } catch (e) {
        alert("invalid config format");
        return;
      }
    }
    if (!cfg.apiKey || !cfg.projectId) {
      alert("missing apiKey or projectId");
      return;
    }
    const ok = await Store.connectCloud(cfg);
    if (ok) {
      scrim.remove();
      state.adminOpen = false;
      renderAdminDrawer();
      setTimeout(() => {
        state.adminOpen = true;
        renderAdminDrawer();
      }, 50);
      alert("Connected to cloud ♡");
    }
  };
}

export function wireTopbar() {
  const ab = document.getElementById("adminBtn");
  if (ab)
    ab.onclick = () => {
      state.adminOpen = !state.adminOpen;
      renderAdminDrawer();
    };
  const lb = document.getElementById("lockBtn");
  if (lb)
    lb.onclick = () => {
      Store.lock();
      render();
    };
}

export function topbar() {
  const d = Store.get();
  return `
  <div class="topbar">
    <div class="brand">${esc(d.couple.name1 || "you")} <span class="brand-dot"></span> <em>${esc(d.couple.name2 || "me")}</em></div>
    <div class="topbar-right">
      <button class="icon-btn" id="adminBtn" title="Manage content">${icon("settings")}</button>
      <button class="icon-btn" id="lockBtn" title="Lock">${icon("lock")}</button>
    </div>
  </div>`;
}

export function menu(active) {
  const items = [
    ["home", "Home"],
    ["gallery", "Gallery"],
    ["letters", "Love Notes"],
    ["map", "Our Map"],
    ["playlist", "Our Playlist"],
  ];
  return `<nav class="menu-nav">${items.map(([k, l]) => `<a href="#/${k}" class="${active === k ? "active" : ""}">${l}</a>`).join("")}</nav>`;
}
