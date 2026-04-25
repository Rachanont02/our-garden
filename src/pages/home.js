import { state } from "../state.js";
import { esc, icon, diffParts, parseYouTubeUrl } from "../utils.js";
import { topbar, menu, wireTopbar } from "../components.js";
import { loadYouTubeAPI } from "../loaders.js";

export function renderHome() {
  const d = Store.get();
  const p = diffParts(d.couple.anniversary);
  state.root.innerHTML = `
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
        ${d.songs.length > 0 ? (() => {
          const rs = d.songs[Math.floor(Math.random() * d.songs.length)];
          return `
          <div class="home-playlist-card" id="homeSongCard" data-yt="${esc(rs.ytUrl || "")}">
            <div class="hp-vinyl" id="homeVinyl"><img src="${esc(rs.cover)}" class="hp-cover"></div>
            <div class="hp-info">
              <div class="label">Our song of the day</div>
              <div class="title">${esc(rs.title)}</div>
              <div class="artist">${esc(rs.artist)}</div>
            </div>
            <div class="hp-play-btn" style="font-size:24px; cursor:pointer; z-index:2" id="homePlayIcon">${icon("play")}</div>
            <div id="home-yt-frame" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none"></div>
          </div>`;
        })() : ""}
        <a href="#/gallery" class="q-card">
          <div class="qico">${icon("photo")}</div>
          <h3>Our Gallery</h3>
          <div class="qc"><span>${d.photos.length} photos</span><span class="qarr">→</span></div>
        </a>
        <a href="#/letters" class="q-card">
          <div class="qico">${icon("letter")}</div>
          <h3>Love Notes</h3>
          <div class="qc"><span>${d.letters.length} letters</span><span class="qarr">→</span></div>
        </a>
        <a href="#/map" class="q-card">
          <div class="qico">${icon("map")}</div>
          <h3>Our Map</h3>
          <div class="qc"><span>${d.places.length} places</span><span class="qarr">→</span></div>
        </a>
      </div>
    </div>
  `;
  wireTopbar();

  const homeCard = document.getElementById("homeSongCard");
  const homePlayBtn = document.getElementById("homePlayIcon");
  if (homeCard && homePlayBtn) {
    const ytUrl = homeCard.dataset.yt;
    if (ytUrl) {
      const initPlayer = async () => {
        if (state.ytPlayer) return;
        await loadYouTubeAPI();
        if (!window.YT || !window.YT.Player) return;
        const parsed = parseYouTubeUrl(ytUrl);
        if (!parsed.id) return;

        let hState = -1;
        state.ytPlayer = new YT.Player("home-yt-frame", {
          height: "1px", width: "1px", videoId: parsed.id,
          host: "https://www.youtube-nocookie.com",
          playerVars: { start: parsed.start, autoplay: 0 },
          events: {
            onReady: (e) => { e.target.playVideo(); },
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
        if (!state.ytPlayer) { initPlayer(); return; }
        if (state.ytPlayer.getPlayerState && state.ytPlayer.getPlayerState() === 1) state.ytPlayer.pauseVideo();
        else if (state.ytPlayer.playVideo) state.ytPlayer.playVideo();
      };
      homeCard.onclick = (e) => {
        if (e.target.closest("#homePlayIcon")) return;
        location.hash = "#/playlist";
      };
    } else { homeCard.onclick = () => (location.hash = "#/playlist"); }
  } else if (homeCard) { homeCard.onclick = () => (location.hash = "#/playlist"); }
}
