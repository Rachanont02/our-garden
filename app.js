// Sage Garden · app
(function () {
  const root = document.getElementById("root");
  let adminOpen = false;
  let openLetter = null;
  let openPlaceId = null;
  let gallerySearch = "";
  let ytPlayer = null;
  let ytState = -1; // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
  let ytVol = 100;
  let autoPlayNext = false;
  let selectedPhotos = [];
  let isSelectMode = false;

  let worldGeoJSON = null;

  // --- Global Error Logger ---
  window.onerror = (msg, url, line, col, error) => {
    Store.log("error", msg, {
      url,
      line,
      col,
      stack: error ? error.stack : null,
    });
  };
  window.onunhandledrejection = (event) => {
    Store.log("promise_error", event.reason ? event.reason.message : "unknown", {
      stack: event.reason ? event.reason.stack : null,
    });
  };

  // --- Lazy Script Loaders (iPhone optimization) ---
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  function loadECharts() {
    return new Promise((resolve, reject) => {
      if (window.echarts) return resolve();
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function loadYouTubeAPI() {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve();
      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        // Already loading, just wait
        const check = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(check);
            resolve();
          }
        }, 100);
        return;
      }
      window.onYouTubeIframeAPIReady = () => resolve();
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }

  // Dispose ECharts to free memory (critical for iOS)
  function disposeCharts() {
    try {
      ["map", "miniMap"].forEach((id) => {
        const dom = document.getElementById(id);
        if (dom && window.echarts) {
          const instance = echarts.getInstanceByDom(dom);
          if (instance) instance.dispose();
        }
      });
    } catch (e) {}
    worldGeoJSON = null; // Free GeoJSON memory
  }

  async function loadWorldMap() {
    if (worldGeoJSON) return;
    try {
      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json",
      );
      worldGeoJSON = await res.json();
      if (window.echarts) echarts.registerMap("world", worldGeoJSON);
    } catch (e) {
      console.error("Failed to load world map", e);
    }
  }

  // --- Custom Dialog ---
  window.alert = (msg) => customDialog(msg, { isConfirm: false });
  function customDialog(msg, { isConfirm = false, isDanger = false } = {}) {
    if (document.activeElement && document.activeElement.blur)
      document.activeElement.blur();
    return new Promise((resolve) => {
      const scrim = document.createElement("div");
      scrim.className = "scrim";
      scrim.style.zIndex = "9999";
      scrim.innerHTML = `
        <div class="dialog" style="max-width:380px;text-align:center;padding:34px 24px;">
          <div class="leaf-decor" style="font-size:32px;margin-bottom:12px;opacity:0.8;">❦</div>
          <div class="dsub" style="font-size:17px;color:var(--ink);margin-bottom:28px;">${esc(msg)}</div>
          <div class="dialog-actions" style="justify-content:center;gap:12px">
            ${isConfirm ? `<button class="btn ghost" data-c>Cancel</button>` : ""}
            <button class="btn" data-o style="${isDanger ? "background:#a86060;border-color:#a86060" : ""}">${isConfirm ? (isDanger ? "Delete" : "Yes") : "OK"}</button>
          </div>
        </div>
      `;
      document.body.appendChild(scrim);
      const close = (val) => {
        scrim.remove();
        resolve(val);
      };

      let focusBtn = null;
      if (isConfirm) {
        focusBtn = scrim.querySelector("[data-c]");
        focusBtn.onclick = () => close(false);
      }
      const okBtn = scrim.querySelector("[data-o]");
      okBtn.onclick = () => close(true);

      if (!focusBtn) focusBtn = okBtn;
      setTimeout(() => focusBtn.focus(), 10);
    });
  }

  // --- Routing (hash-based) ---
  function currentRoute() {
    const h = location.hash.replace("#/", "") || "home";
    const [path, ...rest] = h.split("/");
    return { path, params: rest };
  }
  window.addEventListener("hashchange", render);

  // --- Icons ---
  const ICONS = {
    heart:
      '<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
    photo:
      '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 17-5-5-9 9"/>',
    letter:
      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    map: '<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16M15 5v16"/>',
    settings:
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash:
      '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',
    download:
      '<path d="M12 3v12m-4-4 4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    upload:
      '<path d="M12 21V9m-4 4 4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    music:
      '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    play: '<path d="m5 3 14 9-14 9V3z"/>',
    pause:
      '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
    skipBack: '<path d="M19 20 9 12l10-8v16zM5 19V5"/>',
    skipForward: '<path d="m5 4 10 8-10 8V4zM19 5v14"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    volume:
      '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
  };
  const icon = (k) => `<svg viewBox="0 0 24 24">${ICONS[k]}</svg>`;

  // --- Utils ---
  function esc(s) {
    return String(s == null ? "" : s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  function fmtDateLong(iso) {
    if (!iso) return "";
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // --- Top bar ---
  function topbar() {
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

  // --- Menu ---
  function menu(active) {
    const items = [
      ["home", "Home"],
      ["gallery", "Gallery"],
      ["letters", "Love Notes"],
      ["map", "Our Map"],
      ["playlist", "Our Playlist"],
    ];
    return `<nav class="menu-nav">${items.map(([k, l]) => `<a href="#/${k}" class="${active === k ? "active" : ""}">${l}</a>`).join("")}</nav>`;
  }

  // ---------- LOGIN ----------
  function renderLogin() {
    root.innerHTML = `
    <div class="login-wrap">
      <div class="login-card">
        <div class="leaf-decor">❦</div>
        <h1>Our <em>little</em> garden</h1>
        <div class="sub">— a private place, just for us —</div>
        <form id="loginForm">
          <input type="password" class="pwd-input" id="pwd" placeholder="• • • • • • • •" autocomplete="off" autofocus>
          <div class="err" id="err"></div>
          <div class="pwd-hint">the day we began (ddmmyyyy)</div>
          <button type="submit" class="btn" style="margin-top:26px;width:100%;justify-content:center">Enter</button>
        </form>
        <div class="login-foot">EST. ${fmtDate(Store.get().couple.anniversary).toUpperCase()}</div>
      </div>
    </div>`;
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const entered = document.getElementById("pwd").value.replace(/\D/g, "");
      const anniv = Store.get().couple.anniversary; // YYYY-MM-DD
      const [y, m, dy] = anniv.split("-");
      const expected = `${dy}${m}${y}`; // ddmmyyyy
      const expectedAlt = `${y}${m}${dy}`; // yyyymmdd (be forgiving)
      const expectedAlt2 = `${dy}${m}${y.slice(2)}`; // ddmmyy
      if (
        entered === expected ||
        entered === expectedAlt ||
        entered === expectedAlt2
      ) {
        Store.unlock();
        location.hash = "#/home";
        render();
      } else {
        document.getElementById("err").textContent =
          "not quite — try the date we began";
        document.getElementById("pwd").value = "";
      }
    });
  }

  // ---------- HOME ----------
  function renderHome() {
    const d = Store.get();
    const p = diffParts(d.couple.anniversary);
    root.innerHTML = `
      ${topbar()}
      <div class="page">
        ${menu("home")}
        <div class="home-hero">
          <div class="home-motto">${esc(d.couple.motto)}</div>
          <h1 class="home-title">${esc(d.couple.name1 || "us")} <em>&amp;</em> ${esc(d.couple.name2 || "us")}</h1>
        </div>
        <div class="counter-row">
          <div class="c-cell"><div class="c-num">${p.years}</div><div class="c-lbl">year${p.years === 1 ? "" : "s"}</div><div class="c-corner"></div></div>
          <div class="c-cell"><div class="c-num">${p.months}</div><div class="c-lbl">month${p.months === 1 ? "" : "s"}</div><div class="c-corner"></div></div>
          <div class="c-cell"><div class="c-num">${p.days}</div><div class="c-lbl">day${p.days === 1 ? "" : "s"}</div><div class="c-corner"></div></div>
        </div>
        <div class="total-row">
          <div class="total-cell"><span class="k">Since we began</span><span class="v">${p.totalDays.toLocaleString()} days</span></div>
          <div class="total-cell"><span class="k">Next anniversary in</span><span class="v">${p.daysUntilAnniv} days</span></div>
        </div>
        <div class="quick-grid">
          ${
            d.songs.length > 0
              ? (() => {
                  const rs =
                    d.songs[Math.floor(Math.random() * d.songs.length)];
                  return `
            <div class="home-playlist-card" id="homeSongCard" data-yt="${esc(rs.ytUrl || "")}">
              <div class="hp-vinyl" id="homeVinyl">
                <img src="${esc(rs.cover)}" class="hp-cover">
              </div>
              <div class="hp-info">
                <div class="label">Our song of the day</div>
                <div class="title">${esc(rs.title)}</div>
                <div class="artist">${esc(rs.artist)}</div>
              </div>
              <div class="hp-play-btn" style="font-size:24px; cursor:pointer; z-index:2" id="homePlayIcon">${icon("play")}</div>
              <div id="home-yt-frame" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none"></div>
            </div>`;
                })()
              : ""
          }
          <a href="#/gallery" class="q-card">
            <div class="qico">${icon("photo")}</div>
            <h3>Our Gallery</h3>
            <div class="qd">every moment, kept close</div>
            <div class="qc"><span>${d.photos.length} photo${d.photos.length === 1 ? "" : "s"}</span><span class="qarr">→</span></div>
          </a>
          <a href="#/letters" class="q-card">
            <div class="qico">${icon("letter")}</div>
            <h3>Love Notes</h3>
            <div class="qd">sealed words, softly folded</div>
            <div class="qc"><span>${d.letters.length} letter${d.letters.length === 1 ? "" : "s"}</span><span class="qarr">→</span></div>
          </a>
          <a href="#/map" class="q-card">
            <div class="qico">${icon("map")}</div>
            <h3>Our Map</h3>
            <div class="qd">places we've been together</div>
            <div class="qc"><span>${d.places.length} place${d.places.length === 1 ? "" : "s"}</span><span class="qarr">→</span></div>
          </a>
        </div>
      </div>
    `;
    wireTopbar();

    // Home Play functionality
    const homeCard = document.getElementById("homeSongCard");
    const homePlayBtn = document.getElementById("homePlayIcon");
    if (homeCard && homePlayBtn) {
      const ytUrl = homeCard.dataset.yt;
      if (ytUrl) {
        const initPlayer = async () => {
          if (ytPlayer) return; // already initialized
          await loadYouTubeAPI();
          if (!window.YT || !window.YT.Player) return;
          const parsed = parseYouTubeUrl(ytUrl);
          if (!parsed.id) return;

          let hState = -1;
          ytPlayer = new YT.Player("home-yt-frame", {
            height: "1px",
            width: "1px",
            videoId: parsed.id,
            host: "https://www.youtube-nocookie.com",
            playerVars: { start: parsed.start, autoplay: 0 },
            events: {
              onReady: (e) => {
                e.target.playVideo();
              },
              onStateChange: (e) => {
                hState = e.data;
                const vinyl = document.getElementById("homeVinyl");
                if (homePlayBtn) homePlayBtn.innerHTML = icon(hState === 1 ? "pause" : "play");
                if (vinyl) vinyl.classList.toggle("playing", hState === 1);
              },
            },
          });
        };

        homePlayBtn.onclick = (e) => {
          e.stopPropagation();
          if (!ytPlayer) {
            initPlayer();
            return;
          }
          if (ytPlayer.getPlayerState && ytPlayer.getPlayerState() === 1) ytPlayer.pauseVideo();
          else if (ytPlayer.playVideo) ytPlayer.playVideo();
        };

        homeCard.onclick = (e) => {
          if (e.target.closest("#homePlayIcon")) return;
          location.hash = "#/playlist";
        };
      } else {
        homeCard.onclick = () => (location.hash = "#/playlist");
      }
    } else if (homeCard) {
      homeCard.onclick = () => (location.hash = "#/playlist");
    }
  }

  // ---------- LETTERS ----------
  function renderLetters() {
    const d = Store.get();
    root.innerHTML = `
      ${topbar()}
      <div class="page">
        ${menu("letters")}
        <div class="page-header" style="text-align:center">
          <div class="eyebrow">Love Notes</div>
          <h1 class="page-title">Letters, <em>for you</em></h1>
          <div class="page-sub">softly folded, kept in the drawer</div>
        </div>
        <div class="letters-grid">
          ${d.letters
            .map(
              (l) => `
            <div class="envelope ${esc(l.color || "peach")}" data-letter="${esc(l.id)}">
              <div class="env-flap"></div>
              <div class="env-seal">♡</div>
              <div class="env-to">to ${esc(l.to || "you")}</div>
              <div class="env-meta">
                <div class="env-date">${esc(fmtDate(l.date))}</div>
                <div class="env-title">${esc(l.title || "a little note")}</div>
              </div>
            </div>
          `,
            )
            .join("")}
          <div class="envelope add" id="addLetterBtn">
            <div style="text-align:center">
              <span>+</span>
              <div>write a new note</div>
            </div>
          </div>
        </div>
        ${d.letters.length === 0 ? '<div class="empty" style="grid-column:1/-1"><span class="leaf">❦</span>no letters yet — tap the card above to write one</div>' : ""}
      </div>
    `;
    wireTopbar();
    document.getElementById("addLetterBtn").onclick = () => openLetterEditor();
    root.querySelectorAll("[data-letter]").forEach((el) => {
      el.onclick = () => {
        openLetter = el.dataset.letter;
        render();
      };
    });
    if (openLetter) showLetterDialog();
  }

  function showLetterDialog() {
    const d = Store.get();
    const l = d.letters.find((x) => x.id === openLetter);
    if (!l) {
      openLetter = null;
      return;
    }
    const scrim = document.createElement("div");
    scrim.className = "scrim letter-scrim";
    scrim.innerHTML = `
      <div class="dialog" role="dialog">
        <div class="letter-head">
          <div class="ld">${esc(fmtDateLong(l.date))}</div>
          <div class="ld">${esc(l.from || "")}</div>
        </div>
        <div class="letter-to">Dear <em>${esc(l.to || "you")}</em>,</div>
        <div class="letter-body">${esc(l.body || "")}</div>
        <div class="letter-sign">— always, ${esc(l.from || "yours")}</div>
        <div class="letter-actions">
          <button class="btn ghost" data-edit>Edit</button>
          <button class="btn soft" data-close>Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    scrim.addEventListener("click", (e) => {
      if (e.target === scrim) {
        openLetter = null;
        scrim.remove();
      }
    });
    scrim.querySelector("[data-close]").onclick = () => {
      openLetter = null;
      scrim.remove();
    };
    scrim.querySelector("[data-edit]").onclick = () => {
      scrim.remove();
      openLetterEditor(l);
    };
  }

  function openLetterEditor(letter) {
    const isEdit = !!letter;
    const l = letter || {
      from: Store.get().couple.name1 || "",
      to: Store.get().couple.name2 || "",
      title: "",
      body: "",
      color: "peach",
      date: new Date().toISOString().slice(0, 10),
    };
    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.innerHTML = `
      <div class="dialog">
        <h2>${isEdit ? "Edit note" : "A new note"}</h2>
        <div class="dsub">${isEdit ? "change what needs changing" : "write whatever your heart needs to say"}</div>
        <div class="field"><label>Title</label><input id="ltitle" value="${esc(l.title)}" placeholder="a little note"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field"><label>From</label><input id="lfrom" value="${esc(l.from)}"></div>
          <div class="field"><label>To</label><input id="lto" value="${esc(l.to)}"></div>
        </div>
        <div class="field"><label>Date</label><input type="date" id="ldate" value="${esc(l.date)}"></div>
        <div class="field"><label>Letter</label><textarea id="lbody" placeholder="write from the heart...">${esc(l.body)}</textarea></div>
        <div class="field"><label>Envelope color</label>
          <div class="color-swatches" id="swatches">
            ${["peach", "sage", "blush", "sand", "lavender"].map((c) => `<div class="sw ${c} ${l.color === c ? "active" : ""}" data-color="${c}"></div>`).join("")}
          </div>
        </div>
        <div class="dialog-actions">
          ${isEdit ? '<button class="btn soft" data-del style="margin-right:auto;color:#a86060">Delete</button>' : ""}
          <button class="btn ghost" data-cancel>Cancel</button>
          <button class="btn" data-save>${isEdit ? "Save" : "Seal it"}</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    let color = l.color;
    scrim.querySelectorAll(".sw").forEach(
      (sw) =>
        (sw.onclick = () => {
          color = sw.dataset.color;
          scrim
            .querySelectorAll(".sw")
            .forEach((s) => s.classList.toggle("active", s === sw));
        }),
    );
    scrim.querySelector("[data-cancel]").onclick = () => scrim.remove();
    scrim.querySelector("[data-save]").onclick = () => {
      const patch = {
        title:
          document.getElementById("ltitle").value.trim() || "a little note",
        from: document.getElementById("lfrom").value.trim(),
        to: document.getElementById("lto").value.trim(),
        date: document.getElementById("ldate").value,
        body: document.getElementById("lbody").value,
        color,
      };
      if (isEdit) Store.updateLetter(l.id, patch);
      else Store.addLetter(patch);
      scrim.remove();
      openLetter = null;
      render();
    };
    if (isEdit) {
      scrim.querySelector("[data-del]").onclick = async () => {
        if (
          await customDialog("Delete this note? This cannot be undone.", {
            isConfirm: true,
            isDanger: true,
          })
        ) {
          Store.removeLetter(l.id);
          scrim.remove();
          openLetter = null;
          render();
        }
      };
    }
  }

  // ---------- GALLERY ----------
  function renderGallery() {
    const d = Store.get();
    const q = gallerySearch.toLowerCase();
    const photos = d.photos.filter(
      (p) =>
        !p.placeId &&
        (!q ||
          (p.caption || "").toLowerCase().includes(q) ||
          (p.date || "").includes(q)),
    );
    root.innerHTML = `
      ${topbar()}
      <div class="page">
        ${menu("gallery")}
        <div class="page-header" style="text-align:center">
          <div class="eyebrow">Our Gallery</div>
          <h1 class="page-title">Moments, <em>remembered</em></h1>
          <div class="page-sub">every quiet thing, kept</div>
        </div>
        <div class="gallery-toolbar">
          <div class="search-box">${icon("search")}<input type="text" placeholder="search..." id="gsearch" value="${esc(gallerySearch)}"></div>
          <div style="display:flex;gap:8px">
            ${isSelectMode ? `<button class="btn soft" id="cancelSelect">Cancel</button><button class="btn" id="bulkDeleteBtn" style="background:#a86060;border-color:#a86060">${icon("trash")} Delete (${selectedPhotos.length})</button>` : `<button class="btn soft" id="startSelect">${icon("heart")} Select</button><button class="btn" id="addPhotoBtn">${icon("plus")} Add photo</button>`}
          </div>
        </div>
        ${
          photos.length === 0
            ? `<div class="empty"><span class="leaf">❦</span>${gallerySearch ? "no moments match that" : 'no photos yet — tap "add photo" to begin'}</div>`
            : `
        <div class="masonry ${isSelectMode ? "select-mode" : ""}">
          ${photos
            .map((p) => {
              const isSel = selectedPhotos.includes(p.id);
              return `
            <div class="m-item ${isSel ? "selected" : ""}" data-photo="${esc(p.id)}">
              ${p.url ? `<img src="${esc(p.url)}" alt="${esc(p.caption || "")}" loading="lazy">` : `<div class="m-ph">photo placeholder</div>`}
              <div class="m-sel-check">${isSel ? "✓" : ""}</div>
              ${!isSelectMode ? `<button class="m-del" data-del="${esc(p.id)}" title="Remove">×</button>` : ""}
              ${p.caption || p.date ? `<div class="mcap"><span>${esc(p.caption || "")}</span><span class="mdate">${esc(fmtDate(p.date))}</span></div>` : ""}
            </div>
          `;
            })
            .join("")}
        </div>`
        }
      </div>
    `;
    wireTopbar();

    const addBtn = document.getElementById("addPhotoBtn");
    if (addBtn) addBtn.onclick = () => openPhotoEditor();

    const startSel = document.getElementById("startSelect");
    if (startSel)
      startSel.onclick = () => {
        isSelectMode = true;
        selectedPhotos = [];
        renderGallery();
      };

    const cancelSel = document.getElementById("cancelSelect");
    if (cancelSel)
      cancelSel.onclick = () => {
        isSelectMode = false;
        selectedPhotos = [];
        renderGallery();
      };

    const bulkDel = document.getElementById("bulkDeleteBtn");
    if (bulkDel && selectedPhotos.length > 0) {
      bulkDel.onclick = async () => {
        if (
          await customDialog(
            `Delete ${selectedPhotos.length} selected photos?`,
            { isConfirm: true, isDanger: true },
          )
        ) {
          selectedPhotos.forEach((id) => Store.removePhoto(id));
          selectedPhotos = [];
          isSelectMode = false;
          renderGallery();
        }
      };
    }

    document.getElementById("gsearch").oninput = (e) => {
      gallerySearch = e.target.value;
      renderGallery();
    };

    root.querySelectorAll("[data-photo]").forEach((el) => {
      el.onclick = (e) => {
        if (e.target.matches("[data-del]")) return;
        const id = el.dataset.photo;
        if (isSelectMode) {
          const check = el.querySelector(".m-sel-check");
          if (selectedPhotos.includes(id)) {
            selectedPhotos = selectedPhotos.filter((x) => x !== id);
            el.classList.remove("selected");
            if (check) check.textContent = "";
          } else {
            selectedPhotos.push(id);
            el.classList.add("selected");
            if (check) check.textContent = "✓";
          }
          // Update bulk delete button count
          const bulkBtn = document.getElementById("bulkDeleteBtn");
          if (bulkBtn) {
            bulkBtn.innerHTML = `${icon("trash")} Delete (${selectedPhotos.length})`;
          }
        } else {
          const p = Store.get().photos.find((x) => x.id === id);
          if (p) showLightbox(p);
        }
      };
    });

    root.querySelectorAll("[data-del]").forEach((b) => {
      b.onclick = async (e) => {
        e.stopPropagation();
        if (
          await customDialog("Remove this photo?", {
            isConfirm: true,
            isDanger: true,
          })
        ) {
          Store.removePhoto(b.dataset.del);
          renderGallery();
        }
      };
    });
  }

  function openPhotoEditor(photo) {
    const isEdit = !!photo;
    const p = photo || {
      url: "",
      caption: "",
      date: new Date().toISOString().slice(0, 10),
    };
    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.innerHTML = `
      <div class="dialog">
        <h2>${isEdit ? "Edit photo" : "Add a memory"}</h2>
        <div class="dsub">paste an image URL, or upload from your device</div>
        <div class="field"><label>Image URL</label><input id="purl" value="${esc(p.url)}" placeholder="https://... or leave blank & upload below"></div>
        <div class="field"><label>Or upload</label>
          <input type="file" id="pfile" accept="image/*" multiple>
          <div class="hint">select multiple photos to upload at once.</div>
        </div>
        <div class="field"><label>Caption</label><input id="pcap" value="${esc(p.caption)}" placeholder="a golden afternoon"></div>
        <div class="field"><label>Date</label><input type="date" id="pdate" value="${esc(p.date)}"></div>
        <div class="dialog-actions">
          <button class="btn ghost" data-cancel>Cancel</button>
          <button class="btn" data-save>Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    document.body.classList.add("no-scroll");
    scrim.querySelector("[data-cancel]").onclick = () => {
      document.body.classList.remove("no-scroll");
      scrim.remove();
    };
    scrim.querySelector("[data-save]").onclick = async () => {
      const url = document.getElementById("purl").value.trim();
      const files = document.getElementById("pfile").files;
      const caption = document.getElementById("pcap").value.trim();
      const date = document.getElementById("pdate").value;

      if (!url && files.length === 0) {
        alert("please add a URL or select files");
        return;
      }

      const saveBtn = scrim.querySelector("[data-save]");
      saveBtn.textContent = "Saving...";
      saveBtn.disabled = true;

      try {
        if (isEdit) {
          let editUrl = url;
          if (files.length > 0) editUrl = await fileToDataURL(files[0]);
          Store.updatePhoto(p.id, { url: editUrl, caption, date });
        } else {
          if (url) {
            Store.addPhoto({ url, caption, date });
          }
          for (let i = 0; i < files.length; i++) {
            const dataUrl = await fileToDataURL(files[i]);
            Store.addPhoto({ url: dataUrl, caption, date });
          }
        }
        document.body.classList.remove("no-scroll");
        scrim.remove();
        render();
      } catch (err) {
        alert(err.message || "Failed to process image");
        saveBtn.textContent = "Save";
        saveBtn.disabled = false;
      }
    };
  }

  function fileToDataURL(file) {
    return new Promise((res, rej) => {
      // Resize large images - smaller sizes for iOS to prevent WebKit crash
      const MAX_DIM = isIOS ? 1000 : 1200;
      const MAX_SIZE = isIOS ? 300 * 1024 : 500 * 1024;
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        // Iteratively shrink until under target (gradual steps for better quality)
        while (dataUrl.length > MAX_SIZE && quality > 0.3) {
          quality -= 0.05;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        res(dataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        // If file is very large and couldn't be decoded to canvas, reject it to protect Firestore
        if (file.size > 1024 * 1024) {
          rej(
            new Error(
              "Image format not supported for compression and file is too large. Please use a smaller JPEG/PNG or paste a URL.",
            ),
          );
          return;
        }
        // Fallback to raw read
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = () => rej(r.error);
        r.readAsDataURL(file);
      };
      img.src = url;
    });
  }

  function showLightbox(p) {
    Store.log("debug", "opening lightbox", { photoId: p.id });
    document.body.classList.add("no-scroll");
    const el = document.createElement("div");
    el.className = "lightbox";
    el.innerHTML = `
      <button class="lclose" aria-label="Close">×</button>
      <button class="ldelete" aria-label="Delete">${icon("trash")}</button>
      <img src="${esc(p.url)}">
      ${p.caption || p.date ? `<div class="lcap">${esc(p.caption || "")}${p.caption && p.date ? " · " : ""}${esc(fmtDateLong(p.date))}</div>` : ""}
    `;
    document.body.appendChild(el);
    el.addEventListener("click", (e) => {
      if (e.target === el || e.target.classList.contains("lclose")) {
        document.body.classList.remove("no-scroll");
        el.remove();
      }
    });
    el.querySelector(".ldelete").onclick = async () => {
      if (
        await customDialog("Delete this memory permanently?", {
          isConfirm: true,
          isDanger: true,
        })
      ) {
        Store.removePhoto(p.id);
        document.body.classList.remove("no-scroll");
        el.remove();
        render();
      }
    };
  }

  // ---------- MAP ----------
  async function renderMap() {
    const d = Store.get();
    root.innerHTML = `
      ${topbar()}
      <div class="page">
        ${menu("map")}
        <div class="page-header" style="text-align:center">
          <div class="eyebrow">Our Map</div>
          <h1 class="page-title">Places, <em>together</em></h1>
          <div class="page-sub">every pin, a story</div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
          <button class="btn" id="addPlaceBtn">${icon("plus")} Add a place</button>
        </div>
        <div class="map-layout">
          <div id="map"></div>
          <div class="places-list">
            ${
              d.places.length === 0
                ? `<div class="empty" style="padding:40px 20px"><span class="leaf">❦</span>no places yet</div>`
                : d.places
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(
                      (p) => `
                <div class="place-item" data-place="${esc(p.id)}">
                  <h4>${esc(p.name)}</h4>
                  <div class="pd">${esc(fmtDate(p.date))}</div>
                  <div class="pcount">${(p.photos || []).length + d.photos.filter((x) => x.placeId === p.id).length} photo${(p.photos || []).length + d.photos.filter((x) => x.placeId === p.id).length === 1 ? "" : "s"} →</div>
                </div>
              `,
                    )
                    .join("")
            }
          </div>
        </div>
      </div>
    `;
    wireTopbar();
    document.getElementById("addPlaceBtn").onclick = () => openPlaceEditor();

    await loadECharts();
    if (!window.echarts) {
      root.querySelector("#map").innerHTML = '<div class="empty"><span class="leaf">❦</span>Map could not be loaded on this device.</div>';
      return;
    }
    await loadWorldMap();
    if (worldGeoJSON && window.echarts) echarts.registerMap("world", worldGeoJSON);
    const chartDom = document.getElementById("map");
    if (!chartDom) return;

    // Ensure container has size before init (important for ECharts)
    const myChart = echarts.init(chartDom);

    const sortedPlaces = [...d.places]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter(
        (p) =>
          typeof p.lng === "number" &&
          typeof p.lat === "number" &&
          !isNaN(p.lng) &&
          !isNaN(p.lat),
      );
    const scatterData = sortedPlaces.map((p) => ({
      name: p.name,
      value: [p.lng, p.lat, p.id],
      photos: [
        ...(p.photos || []),
        ...d.photos.filter((x) => x.placeId === p.id).map((x) => x.url),
      ],
      date: p.date,
    }));

    // Hub-and-spoke lines: Oslo as the center, connecting to all other places
    const osloCoord = [10.75, 59.91]; // Oslo, Norway
    const linesData = sortedPlaces
      .filter(
        (p) =>
          Math.sqrt(
            Math.pow(p.lng - osloCoord[0], 2) +
              Math.pow(p.lat - osloCoord[1], 2),
          ) > 0.5,
      )
      .map((p) => ({
        coords: [osloCoord, [p.lng, p.lat]],
      }));

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: function (p, ticket, callback) {
          if (p.seriesType !== "scatter") return "";
          const pName = p.name;
          const pDate = p.data.date;

          const getHtml = (imgSrc) => `
            <div style="text-align:center; width: 160px;">
              <img src="${imgSrc}" style="width: 160px; height: 106px; object-fit: cover; display: block; margin-bottom: 12px; background: #eee; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="font-family:serif; font-weight: 600; font-size: 16px; color:#2a3625; line-height: 1.2;">${pName}</div>
              <div style="font-size: 11px; color:#7a8a60; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">${fmtDate(pDate)}</div>
            </div>
          `;

          window._wikiImageCache = window._wikiImageCache || {};
          if (window._wikiImageCache[pName]) {
            return getHtml(window._wikiImageCache[pName]);
          }

          const fallback =
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="106"><rect width="160" height="106" fill="%23f2f4ec"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">📍</text></svg>';

          const pLat = p.data.value[1];
          const pLng = p.data.value[0];

          return getHtml(fallback);
        },
        backgroundColor: "#ffffff",
        borderColor: "#e1e3d6",
        borderWidth: 1,
        padding: [8, 8, 16, 8],
        extraCssText:
          "box-shadow: 0 12px 30px rgba(30, 40, 20, 0.2); border-radius: 4px;",
      },
      geo: {
        map: "world",
        roam: true,
        itemStyle: {
          areaColor: "#2b3626",
          borderColor: "#4a5838",
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: { areaColor: "#3a4a35" },
          label: { show: false },
        },
      },
      series: [
        {
          type: "scatter",
          coordinateSystem: "geo",
          data: scatterData,
          symbol: "pin",
          symbolSize: 18,
          symbolOffset: [0, "-50%"],
          itemStyle: {
            color: "#e6b99a",
            shadowBlur: 10,
            shadowColor: "#e6b99a",
          },
        },
        {
          type: "lines",
          coordinateSystem: "geo",
          data: linesData,
          lineStyle: {
            color: "#ffffffff",
            width: 1,
            opacity: 0.4,
            curveness: 0.3,
            type: "dashed",
          },
        },
        {
          type: "scatter",
          coordinateSystem: "geo",
          data: [{ name: "Home 🏠", value: [10.75, 59.91] }],
          symbol: "pin",
          symbolSize: 26,
          symbolOffset: [0, "-50%"],
          itemStyle: {
            color: "#e05a5a",
            shadowBlur: 14,
            shadowColor: "rgba(224,90,90,0.5)",
          },
          label: { show: true, formatter: "🏠", fontSize: 10, offset: [0, -2] },
          silent: true,
          z: 5,
        },
      ],
    };

    myChart.setOption(option);
    myChart.on("click", (params) => {
      if (
        params.componentType === "series" &&
        params.seriesType === "scatter"
      ) {
        const p = Store.get().places.find((x) => x.id === params.data.value[2]);
        if (p) {
          openPlaceId = p.id;
          render();
        }
      }
    });

    root.querySelectorAll(".place-item").forEach((el) => {
      el.onclick = () => {
        openPlaceId = el.dataset.place;
        render();
      };
      el.onmouseenter = () => {
        el.classList.add("active");
        const p = Store.get().places.find((x) => x.id === el.dataset.place);
        if (p && typeof p.lng === "number") {
          myChart.dispatchAction({
            type: "showTip",
            seriesIndex: 0,
            name: p.name,
          });
          myChart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            name: p.name,
          });
        }
      };
      el.onmouseleave = () => {
        el.classList.remove("active");
        myChart.dispatchAction({ type: "downplay", seriesIndex: 0 });
      };
    });

    window.addEventListener("resize", () => {
      if (myChart) myChart.resize();
    });

    if (openPlaceId) showPlaceDialog();
  }

  function showPlaceDialog(initialScroll = 0) {
    Store.log("debug", "opening showPlaceDialog", { placeId: openPlaceId });
    const d = Store.get();
    const p = d.places.find((x) => x.id === openPlaceId);
    if (!p) {
      openPlaceId = null;
      return;
    }
    const pPhotos = d.photos.filter((x) => x.placeId === p.id);
    const legacyPhotos = p.photos || [];

    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.innerHTML = `
      <div class="dialog" style="max-width:680px">
        <div class="dialog-header" style="align-items: center;">
          <div class="header-left">
            <div class="eyebrow">${esc(fmtDateLong(p.date))}</div>
            <h2 style="margin-bottom:0">${esc(p.name)}</h2>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            ${isSelectMode ? `
              <button class="btn" id="bulkDeletePlaceBtn" style="background:#a86060;border-color:#a86060;padding:6px 12px;font-size:13px">${icon("trash")} Delete (${selectedPhotos.length})</button>
              <button class="btn soft" id="startPlaceSelect" style="padding:6px 12px;font-size:13px">Cancel</button>
            ` : `
              <button class="btn soft" id="startPlaceSelect" style="padding:6px 12px;font-size:13px">${icon("heart")} Select</button>
              <button class="icon-btn close-dialog" data-close aria-label="Close">×</button>
            `}
          </div>
        </div>
        
        ${p.note ? `<div class="place-note" style="margin-top:12px">${esc(p.note)}</div>` : ""}
        
        <div class="divider"></div>
        
        <div class="section-title">Photos from here</div>

        <div class="place-photos ${isSelectMode ? "select-mode" : ""}">
          ${legacyPhotos.map((src, i) => {
            const id = `legacy-${i}`;
            const isSel = selectedPhotos.includes(id);
            return `
            <div class="pp ${isSel ? "selected" : ""}" data-ppi="${id}">
              <img src="${esc(src)}">
              <div class="m-sel-check">${isSel ? "✓" : ""}</div>
              ${!isSelectMode ? `<button class="m-del" data-legacy-ppdel="${i}">×</button>` : ""}
            </div>
          `;
          }).join("")}
          ${pPhotos.map((ph) => {
            const isSel = selectedPhotos.includes(ph.id);
            return `
            <div class="pp ${isSel ? "selected" : ""}" data-ppid="${esc(ph.id)}">
              <img src="${esc(ph.url)}">
              <div class="m-sel-check">${isSel ? "✓" : ""}</div>
              ${!isSelectMode ? `<button class="m-del" data-ppdel="${esc(ph.id)}">×</button>` : ""}
            </div>
          `;
          }).join("")}
          ${!isSelectMode ? `<div class="pp-add" id="addPP">+</div>` : ""}
        </div>

        <div class="dialog-footer">
          <button class="btn ghost" data-edit>Edit place details</button>
          <button class="btn" data-close>Done</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    if (initialScroll) scrim.querySelector(".dialog").scrollTop = initialScroll;
    document.body.classList.add("no-scroll");
    scrim.addEventListener("click", (e) => {
      if (e.target === scrim) {
        openPlaceId = null;
        document.body.classList.remove("no-scroll");
        scrim.remove();
      }
    });
    scrim.querySelectorAll("[data-close]").forEach(
      (b) =>
        (b.onclick = () => {
          openPlaceId = null;
          document.body.classList.remove("no-scroll");
          scrim.remove();
        }),
    );
    scrim.querySelector("[data-edit]").onclick = () => {
      isSelectMode = false;
      selectedPhotos = [];
      document.body.classList.remove("no-scroll");
      scrim.remove();
      openPlaceEditor(p);
    };
    const startBtn = scrim.querySelector("#startPlaceSelect");
    if (startBtn)
      startBtn.onclick = () => {
        const currentScroll = scrim.querySelector(".dialog").scrollTop;
        isSelectMode = !isSelectMode;
        selectedPhotos = [];
        scrim.remove();
        showPlaceDialog(currentScroll);
      };

    const bulkBtn = scrim.querySelector("#bulkDeletePlaceBtn");
    if (bulkBtn && selectedPhotos.length > 0) {
      bulkBtn.onclick = async () => {
        if (
          await customDialog(`Delete ${selectedPhotos.length} selected photos?`, {
            isConfirm: true,
            isDanger: true,
          })
        ) {
          const nextLegacy = [...legacyPhotos];
          const legacyToDelete = selectedPhotos
            .filter((id) => id.startsWith("legacy-"))
            .map((id) => parseInt(id.split("-")[1]))
            .sort((a, b) => b - a);

          legacyToDelete.forEach((idx) => nextLegacy.splice(idx, 1));
          if (legacyToDelete.length > 0) {
            Store.updatePlace(p.id, { photos: nextLegacy });
          }

          selectedPhotos
            .filter((id) => !id.startsWith("legacy-"))
            .forEach((id) => Store.removePhoto(id));

          selectedPhotos = [];
          isSelectMode = false;
          scrim.remove();
          showPlaceDialog();
        }
      };
    }

    const addPP = scrim.querySelector("#addPP");
    if (addPP) addPP.onclick = () => addPhotoToPlace(p.id);

    scrim.querySelectorAll(".pp").forEach((el) => {
      el.onclick = (e) => {
        if (e.target.matches("[data-legacy-ppdel], [data-ppdel]")) return;
        const id = el.dataset.ppid || el.dataset.ppi;
        if (isSelectMode) {
          const check = el.querySelector(".m-sel-check");
          if (selectedPhotos.includes(id)) {
            selectedPhotos = selectedPhotos.filter((x) => x !== id);
            el.classList.remove("selected");
            if (check) check.textContent = "";
          } else {
            selectedPhotos.push(id);
            el.classList.add("selected");
            if (check) check.textContent = "✓";
          }
          // Update bulk delete button count
          const bulkBtn = scrim.querySelector("#bulkDeletePlaceBtn");
          if (bulkBtn) {
            bulkBtn.innerHTML = `${icon("trash")} Delete (${selectedPhotos.length})`;
          }
        } else {
          if (el.dataset.ppid) {
            const ph = Store.get().photos.find((x) => x.id === el.dataset.ppid);
            if (ph) showLightbox(ph);
          } else {
            showLightbox({
              url: legacyPhotos[parseInt(el.dataset.ppi.split("-")[1])],
              caption: p.name,
              date: p.date,
            });
          }
        }
      };
    });
  }

  function addPhotoToPlace(placeId) {
    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.innerHTML = `
      <div class="dialog">
        <h2>Add a photo</h2>
        <div class="dsub">from this place</div>
        <div class="field"><label>Image URL</label><input id="purl" placeholder="https://..."></div>
        <div class="field"><label>Or upload</label><input type="file" id="pfile" accept="image/*" multiple></div>
        <div class="dialog-actions">
          <button class="btn ghost" data-cancel>Cancel</button>
          <button class="btn" data-save>Add</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    scrim.querySelector("[data-cancel]").onclick = () => scrim.remove();
    scrim.querySelector("[data-save]").onclick = async () => {
      const url = document.getElementById("purl").value.trim();
      const files = document.getElementById("pfile").files;
      if (!url && files.length === 0) {
        alert("add a URL or select files first");
        return;
      }

      const saveBtn = scrim.querySelector("[data-save]");
      saveBtn.textContent = "Adding...";
      saveBtn.disabled = true;

      try {
        const place = Store.get().places.find((x) => x.id === placeId);
        if (url) {
          Store.addPhoto({
            url,
            caption: place.name,
            date: place.date,
            placeId: place.id,
          });
        }
        let failCount = 0;
        for (let i = 0; i < files.length; i++) {
          try {
            const dataUrl = await fileToDataURL(files[i]);
            Store.addPhoto({
              url: dataUrl,
              caption: place.name,
              date: place.date,
              placeId: place.id,
            });
          } catch (e) {
            console.error("Failed to process file", i, e);
            failCount++;
          }
        }
        if (failCount > 0)
          alert(
            `Failed to upload ${failCount} photo(s). They might be too large or unsupported.`,
          );
        scrim.remove();
        render();
      } catch (err) {
        alert(err.message || "Failed to process image");
        saveBtn.textContent = "Add";
        saveBtn.disabled = false;
      }
    };
  }

  function openPlaceEditor(place) {
    const isEdit = !!place;
    const p = place || {
      name: "",
      note: "",
      lat: "",
      lng: "",
      date: new Date().toISOString().slice(0, 10),
      photos: [],
    };
    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.innerHTML = `
      <div class="dialog">
        <h2>${isEdit ? "Edit place" : "A new place"}</h2>
        <div class="dsub">where were we?</div>
        <div class="field"><label>Name</label><input id="nname" value="${esc(p.name)}" placeholder="e.g. Kyoto, the little cafe in Kyoto..."></div>
        <div class="field"><label>Date we were there</label><input type="date" id="ndate" value="${esc(p.date)}"></div>
        <div class="field"><label>A little note</label><textarea id="nnote" placeholder="what was special about it">${esc(p.note)}</textarea></div>
        <div style="display:none">
          <input id="nlat" value="${esc(p.lat)}">
          <input id="nlng" value="${esc(p.lng)}">
        </div>
        <div class="field" style="margin-top:12px">
          <label>Location</label>
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <input id="locSearch" placeholder="Search a city, cafe, or place..." style="flex:1">
            <button class="btn soft" id="locSearchBtn" style="padding:0 16px">Search</button>
          </div>
          <div id="miniMap" style="height:220px;border-radius:8px;border:1px solid #d9dcd0;overflow:hidden;"></div>
          <div class="hint" style="margin-top:6px">Tip: You can search or just click anywhere on the map to drop a pin.</div>
        </div>
        <div class="dialog-actions" style="margin-top:18px">
          ${isEdit ? '<button class="btn soft" data-del style="margin-right:auto;color:#a86060">Delete</button>' : ""}
          <button class="btn ghost" data-cancel>Cancel</button>
          <button class="btn" data-save>Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);

    // Initialize minimap
    let miniChart;
    setTimeout(async () => {
      await loadWorldMap();
      const miniMapDom = document.getElementById("miniMap");
      if (!miniMapDom) return;
      miniChart = echarts.init(miniMapDom);

      const lat = parseFloat(document.getElementById("nlat").value) || 20;
      const lng = parseFloat(document.getElementById("nlng").value) || 0;
      const initialZoom = p.lat ? 5 : 1.2;

      const updateMiniMap = (mlat, mlng, mzoom) => {
        miniChart.setOption({
          backgroundColor: "#1a2118",
          geo: {
            map: "world",
            roam: true,
            center: [mlng, mlat],
            zoom: mzoom || initialZoom,
            itemStyle: {
              areaColor: "#283324",
              borderColor: "#3b4b35",
              borderWidth: 1,
            },
            emphasis: { itemStyle: { areaColor: "#3a4a35" } },
          },
          series: [
            {
              type: "scatter",
              coordinateSystem: "geo",
              data: [[mlng, mlat]],
              symbol: "pin",
              symbolSize: 18,
              symbolOffset: [0, "-50%"],
              itemStyle: { color: "#e6b99a" },
            },
          ],
        });
      };

      updateMiniMap(lat, lng, initialZoom);

      miniChart.getZr().on("click", function (e) {
        const coord = miniChart.convertFromPixel("geo", [e.offsetX, e.offsetY]);
        if (coord) {
          document.getElementById("nlng").value = coord[0].toFixed(6);
          document.getElementById("nlat").value = coord[1].toFixed(6);
          // Keep current zoom and center
          const opt = miniChart.getOption();
          const currZoom = opt.geo[0].zoom;
          updateMiniMap(coord[1], coord[0], currZoom);
        }
      });
    }, 50);

    const searchBtn = scrim.querySelector("#locSearchBtn");
    const searchInput = scrim.querySelector("#locSearch");
    const doSearch = async (e) => {
      if (e) e.preventDefault();
      const q = searchInput.value.trim();
      if (!q) return;
      searchBtn.textContent = "...";
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
        );
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          document.getElementById("nlat").value = lat.toFixed(6);
          document.getElementById("nlng").value = lng.toFixed(6);
          if (miniChart) {
            miniChart.setOption({
              geo: { center: [lng, lat], zoom: 5 },
              series: [{ data: [[lng, lat]] }],
            });
          }
        } else {
          alert(
            "Place not found. Try a different search term or click on the map.",
          );
        }
      } catch (err) {
        alert("Search failed");
      }
      searchBtn.textContent = "Search";
    };
    searchBtn.onclick = doSearch;
    searchInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        doSearch();
      }
    };

    scrim.querySelector("[data-cancel]").onclick = () => scrim.remove();
    scrim.querySelector("[data-save]").onclick = async () => {
      const patch = {
        name: document.getElementById("nname").value.trim(),
        note: document.getElementById("nnote").value.trim(),
        date: document.getElementById("ndate").value,
        lat: parseFloat(document.getElementById("nlat").value),
        lng: parseFloat(document.getElementById("nlng").value),
      };
      if (!patch.name) {
        alert("give it a name");
        return;
      }
      if (Number.isNaN(patch.lat) || Number.isNaN(patch.lng)) {
        if (
          !(await customDialog(
            "Latitude/Longitude missing — it won't show on the map. Save anyway?",
            { isConfirm: true },
          ))
        )
          return;
        if (Number.isNaN(patch.lat)) patch.lat = null;
        if (Number.isNaN(patch.lng)) patch.lng = null;
      }
      if (isEdit) Store.updatePlace(p.id, patch);
      else Store.addPlace(patch);
      scrim.remove();
      openPlaceId = null;
      render();
    };
    if (isEdit) {
      scrim.querySelector("[data-del]").onclick = async () => {
        if (
          await customDialog("Delete this place and all its photos?", {
            isConfirm: true,
            isDanger: true,
          })
        ) {
          Store.removePlace(p.id);
          scrim.remove();
          openPlaceId = null;
          render();
        }
      };
    }
  }

  // ---------- Admin drawer ----------
  // ---------- PLAYLIST ----------
  async function renderPlaylist() {
    const d = Store.get();
    const songs = d.songs;
    const active = songs[0] || null;

    root.innerHTML = `
      ${topbar()}
      <div class="page">
        ${menu("playlist")}
        <div class="playlist-header">
          <div class="eyebrow">Our Playlist</div>
          <h1 class="page-title">Songs of <em>us</em></h1>
        </div>

        <div class="playlist-main">
          ${
            active
              ? `
            <div class="now-playing-card">
              <div class="player-cover-wrap">
                <img src="${esc(active.cover)}" class="player-cover">
                <div class="vinyl-disc"></div>
              </div>
              <div class="player-info">
                <h2>${esc(active.title)}</h2>
                <div class="artist">${esc(active.artist)}</div>
              </div>
              <div class="p-progress"><div class="p-bar"></div></div>
              <div class="player-controls">
                <button class="p-btn" id="skipBackBtn">${icon("skipBack")}</button>
                <button class="p-btn main" id="playActive">${icon("play")}</button>
                <button class="p-btn" id="skipForwardBtn">${icon("skipForward")}</button>
              </div>
              <div class="vol-control">
                ${icon("volume")}
                <input type="range" id="volSlider" min="0" max="100" value="${ytVol}">
              </div>
              ${
                active.ytUrl
                  ? `<div id="yt-player-frame" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none"></div>`
                  : ""
              }
            </div>
          `
              : `
            <div class="empty">No songs yet. Add your favorite memory to start the music.</div>
          `
          }

          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px">
              <h3 style="font-family:var(--serif); font-size:24px">Tracklist</h3>
              <button class="btn" id="addSongBtn">${icon("plus")} Add song</button>
            </div>
            <div class="song-grid">
              ${songs
                .map(
                  (s) => `
                <div class="song-card" data-sid="${esc(s.id)}">
                  <img src="${esc(s.cover)}">
                  <h4>${esc(s.title)}</h4>
                  <p>${esc(s.artist)}</p>
                  <button class="m-edit" data-sedit="${esc(s.id)}">${icon("edit")}</button>
                  <button class="m-del" data-sdel="${esc(s.id)}">×</button>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;
    wireTopbar();

    // YouTube API Integration - lazy load
    const playBtn = document.getElementById("playActive");
    if (active && active.ytUrl) {
      await loadYouTubeAPI();
    }
    if (active && active.ytUrl && window.YT && window.YT.Player) {
      const parsed = parseYouTubeUrl(active.ytUrl);
      if (parsed.id) {
        if (ytPlayer) {
          try {
            ytPlayer.destroy();
          } catch (e) {}
          ytPlayer = null;
          ytState = -1;
        }

        ytPlayer = new YT.Player("yt-player-frame", {
          height: "100%",
          width: "100%",
          videoId: parsed.id,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            start: parsed.start,
            autoplay: 0,
          },
          events: {
            onReady: (e) => {
              e.target.setVolume(ytVol);
              if (autoPlayNext) {
                autoPlayNext = false;
                setTimeout(() => {
                  if (typeof e.target.playVideo === "function")
                    e.target.playVideo();
                }, 100);
              }
            },
            onStateChange: (e) => {
              ytState = e.data;
              const wrap = document.querySelector(".player-cover-wrap");
              if (playBtn)
                playBtn.innerHTML = icon(ytState === 1 ? "pause" : "play");
              if (wrap) wrap.classList.toggle("playing", ytState === 1);
            },
          },
        });
      }
    }

    if (playBtn) {
      playBtn.onclick = () => {
        if (!ytPlayer || typeof ytPlayer.playVideo !== "function") {
          autoPlayNext = true;
          return;
        }
        if (ytState === 1) ytPlayer.pauseVideo();
        else ytPlayer.playVideo();
      };
    }

    document.getElementById("skipBackBtn").onclick = () => {
      if (songs.length < 2) return;
      autoPlayNext = false;
      Store.set((d) => {
        const last = d.songs.pop();
        d.songs.unshift(last);
      });
      render();
    };

    document.getElementById("skipForwardBtn").onclick = () => {
      if (songs.length < 2) return;
      autoPlayNext = false;
      Store.set((d) => {
        const first = d.songs.shift();
        d.songs.push(first);
      });
      render();
    };

    const volSlider = document.getElementById("volSlider");
    if (volSlider) {
      volSlider.oninput = (e) => {
        ytVol = parseInt(e.target.value);
        if (ytPlayer && ytPlayer.setVolume) ytPlayer.setVolume(ytVol);
      };
    }

    document.getElementById("addSongBtn").onclick = () => openSongEditor();

    document.querySelectorAll("[data-sedit]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const sid = btn.dataset.sedit;
        const song = songs.find((x) => x.id === sid);
        if (song) openSongEditor(song);
      };
    });

    document.querySelectorAll(".song-card").forEach((el) => {
      el.onclick = (e) => {
        if (e.target.closest(".m-del") || e.target.closest(".m-edit")) return;
        const sid = el.dataset.sid;
        const song = songs.find((x) => x.id === sid);
        if (song) {
          autoPlayNext = false;
          // Move song to top (active)
          const others = songs.filter((x) => x.id !== sid);
          Store.set((d) => {
            d.songs = [song, ...others];
          });
          render();
        }
      };
    });

    document.querySelectorAll("[data-sdel]").forEach((btn) => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        if (
          await customDialog("Remove this song from our playlist?", {
            isConfirm: true,
            isDanger: true,
          })
        ) {
          Store.removeSong(btn.dataset.sdel);
          render();
        }
      };
    });
  }

  function parseYouTubeUrl(url) {
    if (!url) return { id: null, start: 0 };
    let id = null;
    let start = 0;
    try {
      const urlObj = new URL(url);
      if (
        urlObj.hostname.includes("youtube.com") ||
        urlObj.hostname.includes("youtu.be")
      ) {
        id = urlObj.searchParams.get("v");
        if (!id && urlObj.hostname.includes("youtu.be")) {
          id = urlObj.pathname.slice(1);
        }
        if (!id && urlObj.pathname.includes("/embed/")) {
          id = urlObj.pathname.split("/")[2];
        }
        const t = urlObj.searchParams.get("t");
        if (t) {
          if (t.includes("m") || t.includes("s")) {
            const minMatch = t.match(/(\d+)m/);
            const secMatch = t.match(/(\d+)s/);
            const m = minMatch ? parseInt(minMatch[1]) : 0;
            const s = secMatch ? parseInt(secMatch[1]) : 0;
            start = m * 60 + s;
          } else {
            start = parseInt(t);
          }
        }
      }
    } catch (e) {}
    if (!id) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      id = match && match[2].length === 11 ? match[2] : null;
    }
    return { id, start };
  }

  function openSongEditor(songToEdit = null) {
    const isEdit = !!songToEdit;
    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.innerHTML = `
      <div class="dialog">
        <h2>${isEdit ? "Edit Song" : "Add to Playlist"}</h2>
        <div class="dsub">${isEdit ? "Update details for this memory" : "What song represents us?"}</div>
        <div class="field"><label>Song Title</label><input type="text" id="stitle" placeholder="e.g. Love Story" value="${esc(songToEdit?.title || "")}"></div>
        <div class="field"><label>Artist</label><input type="text" id="sartist" placeholder="e.g. Taylor Swift" value="${esc(songToEdit?.artist || "")}"></div>
        <div class="field">
          <label>YouTube Link (Optional)</label>
          <input type="text" id="syt" placeholder="https://youtube.com/..." value="${esc(songToEdit?.ytUrl || "")}">
          <div class="hint">Hint: To start at the hook, add <code>?t=60</code> or <code>?t=1m30s</code> to the end of the link.</div>
        </div>
        <div class="field"><label>Cover Image</label><input type="file" id="scover" accept="image/*"></div>
        <div class="dialog-actions">
          <button class="btn ghost" onclick="this.closest('.scrim').remove()">Cancel</button>
          <button class="btn" id="saveSongBtn">${isEdit ? "Save Changes" : "Add Song"}</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    const saveBtn = document.getElementById("saveSongBtn");
    saveBtn.onclick = async () => {
      const title = document.getElementById("stitle").value;
      const artist = document.getElementById("sartist").value;
      const ytUrl = document.getElementById("syt").value;
      const file = document.getElementById("scover").files[0];
      if (!title || !artist) return alert("Please enter title and artist");

      saveBtn.disabled = true;
      saveBtn.textContent = isEdit ? "Saving..." : "Adding...";
      try {
        let cover = songToEdit
          ? songToEdit.cover
          : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">🎵</text></svg>';
        if (file) cover = await fileToDataURL(file);

        const patch = { title, artist, ytUrl, cover };
        if (isEdit) {
          Store.updateSong(songToEdit.id, patch);
        } else {
          Store.addSong(patch);
        }

        scrim.remove();
        render();
      } catch (e) {
        alert("Failed to process image");
        saveBtn.disabled = false;
        saveBtn.textContent = isEdit ? "Save Changes" : "Add Song";
      }
    };
  }

  function showLogsDialog() {
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

  function renderAdminDrawer() {
    // Clean up any existing drawer + scrim first
    document
      .querySelectorAll(".drawer-scrim, .drawer")
      .forEach((el) => el.remove());
    if (!adminOpen) return;
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
          ${
            Store.cloud.connected
              ? "data syncs automatically across all devices. both of you see updates in realtime."
              : "free · syncs data between you & your partner automatically. see setup guide in FIREBASE_SETUP.md"
          }
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
        <p style="font-family:var(--serif);font-style:italic;color:var(--ink-soft);font-size:14px;margin-bottom:12px;line-height:1.5">export a JSON file as manual backup. keep it in Google Drive or email.</p>
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
        <p style="font-family:var(--serif);font-style:italic;color:var(--ink-soft);font-size:13px;margin-bottom:10px">clears all photos, letters & places in this browser. export first!</p>
        <button class="btn soft" id="resetBtn" style="color:#a86060;border-color:#d9b4ae">Reset everything</button>
      </div>
    `;
    document.body.appendChild(drawer);
    scrim.onclick = () => {
      adminOpen = false;
      renderAdminDrawer();
    };
    drawer.querySelector("[data-close]").onclick = () => {
      adminOpen = false;
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
      adminOpen = false;
      renderAdminDrawer();
      render();
    };

    drawer.querySelector("#exportBtn").onclick = () => Store.exportJSON();
    drawer.querySelector("#logsBtn").onclick = () => {
      adminOpen = false;
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
          adminOpen = false;
          renderAdminDrawer();
          setTimeout(() => {
            adminOpen = true;
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
        adminOpen = false;
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
        adminOpen = false;
        renderAdminDrawer();
        location.hash = "#/home";
        render();
      }
    };
    drawer.querySelectorAll("[data-quick]").forEach((b) => {
      b.onclick = () => {
        adminOpen = false;
        renderAdminDrawer();
        if (b.dataset.quick === "letter") openLetterEditor();
        if (b.dataset.quick === "photo") openPhotoEditor();
        if (b.dataset.quick === "place") openPlaceEditor();
        if (b.dataset.quick === "song") openSongEditor();
      };
    });
  }

  function openFirebaseConnect() {
    const existing = Store.cloud.config || {};
    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.innerHTML = `
      <div class="dialog" style="max-width:560px">
        <h2>Connect to Firebase</h2>
        <div class="dsub">paste your firebaseConfig from the Firebase console</div>
        <div class="field">
          <label>firebaseConfig (paste the whole object)</label>
          <textarea id="fbcfg" style="font-family:monospace;font-size:13px;min-height:180px" placeholder='{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  ...
}'>${existing.apiKey ? JSON.stringify(existing, null, 2) : ""}</textarea>
          <div class="hint">need help? open FIREBASE_SETUP.md for 5-minute setup guide</div>
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
        // Accept both JSON and JS object literal
        cfg = JSON.parse(raw);
      } catch {
        try {
          // try eval-ish parse (remove "const firebaseConfig =" prefix if any)
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
        adminOpen = false;
        renderAdminDrawer();
        setTimeout(() => {
          adminOpen = true;
          renderAdminDrawer();
        }, 50);
        alert("Connected to cloud ♡ data now syncs automatically");
      }
    };
  }

  function wireTopbar() {
    const ab = document.getElementById("adminBtn");
    if (ab)
      ab.onclick = () => {
        adminOpen = !adminOpen;
        renderAdminDrawer();
      };
    const lb = document.getElementById("lockBtn");
    if (lb)
      lb.onclick = () => {
        Store.lock();
        render();
      };
  }

  // ---------- Main render ----------
  function hideSkeleton() {
    const sl = document.getElementById("skeletonLoader");
    if (sl && !sl.classList.contains("hidden")) {
      setTimeout(() => sl.classList.add("hidden"), 500);
      setTimeout(() => sl.remove(), 1000);
    }
  }

  function render() {
    // Dispose ECharts before removing DOM (memory cleanup for iOS)
    disposeCharts();
    // Destroy YouTube player when navigating away
    if (ytPlayer) {
      try { ytPlayer.destroy(); } catch (e) {}
      ytPlayer = null;
      ytState = -1;
    }
    document.querySelectorAll(".scrim").forEach((el) => el.remove());
    const d = Store.get();
    if (!d.session.unlocked) {
      renderLogin();
      hideSkeleton();
      return;
    }
    const r = currentRoute();
    switch (r.path) {
      case "home":
        renderHome();
        break;
      case "letters":
        renderLetters();
        break;
      case "gallery":
        renderGallery();
        break;
      case "map":
        renderMap();
        break;
      case "playlist":
        renderPlaylist();
        break;
      default:
        location.hash = "#/home";
        renderHome();
    }
    hideSkeleton();
  }

  // Initial route
  if (!location.hash) location.hash = "#/home";
  Store.init().then(() => render());

  // Global resize handler for responsive map layout on iPad/Mobile
  window.addEventListener("resize", () => {
    try {
      const mapDom = document.getElementById("map");
      if (mapDom && window.echarts) {
        const chart = echarts.getInstanceByDom(mapDom);
        if (chart) chart.resize();
      }
      const miniMapDom = document.getElementById("miniMap");
      if (miniMapDom && window.echarts) {
        const miniChart = echarts.getInstanceByDom(miniMapDom);
        if (miniChart) miniChart.resize();
      }
    } catch (e) {}
  });
})();
