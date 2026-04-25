import { state } from "../state.js";
import {
  esc,
  icon,
  parseYouTubeUrl,
  fileToDataURL,
  customDialog,
} from "../utils.js";
import { topbar, menu, wireTopbar } from "../components.js";
import { loadYouTubeAPI } from "../loaders.js";
import { render } from "../main.js";

export async function renderPlaylist() {
  const d = Store.get();
  const songs = d.songs;
  const active = songs[0] || null;

  state.root.innerHTML = `
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
            <div class="player-cover-wrap"><img src="${esc(active.cover)}" class="player-cover"><div class="vinyl-disc"></div></div>
            <div class="player-info"><h2>${esc(active.title)}</h2><div class="artist">${esc(active.artist)}</div></div>
            <div class="p-progress"><div class="p-bar"></div></div>
            <div class="player-controls">
              <button class="p-btn" id="skipBackBtn">${icon("skipBack")}</button>
              <button class="p-btn main" id="playActive">${icon("play")}</button>
              <button class="p-btn" id="skipForwardBtn">${icon("skipForward")}</button>
            </div>
            <div class="vol-control">${icon("volume")}<input type="range" id="volSlider" min="0" max="100" value="${state.ytVol}"></div>
            ${active.ytUrl ? `<div id="yt-player-frame" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none"></div>` : ""}
          </div>
        `
            : `<div class="empty">No songs yet.</div>`
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

  const playBtn = document.getElementById("playActive");
  if (active && active.ytUrl) {
    await loadYouTubeAPI();
    if (window.YT && window.YT.Player) {
      const parsed = parseYouTubeUrl(active.ytUrl);
      if (parsed.id) {
        if (state.ytPlayer) {
          try {
            state.ytPlayer.destroy();
          } catch (e) {}
          state.ytPlayer = null;
          state.ytState = -1;
        }
        state.ytPlayer = new YT.Player("yt-player-frame", {
          height: "1px",
          width: "1px",
          videoId: parsed.id,
          host: "https://www.youtube-nocookie.com",
          playerVars: { start: parsed.start, autoplay: 0 },
          events: {
            onReady: (e) => {
              e.target.setVolume(state.ytVol);
              if (state.autoPlayNext) {
                state.autoPlayNext = false;
                setTimeout(() => e.target.playVideo(), 100);
              }
            },
            onStateChange: (e) => {
              state.ytState = e.data;
              const wrap = document.querySelector(".player-cover-wrap");
              if (playBtn)
                playBtn.innerHTML = icon(
                  state.ytState === 1 ? "pause" : "play",
                );
              if (wrap) wrap.classList.toggle("playing", state.ytState === 1);
            },
          },
        });
      }
    }
  }

  if (playBtn) {
    playBtn.onclick = () => {
      if (!state.ytPlayer || typeof state.ytPlayer.playVideo !== "function") {
        state.autoPlayNext = true;
        return;
      }
      if (state.ytState === 1) state.ytPlayer.pauseVideo();
      else state.ytPlayer.playVideo();
    };
  }

  document.getElementById("skipBackBtn").onclick = () => {
    if (songs.length < 2) return;
    state.autoPlayNext = false;
    Store.set((d) => {
      const last = d.songs.pop();
      d.songs.unshift(last);
    });
    render();
  };

  document.getElementById("skipForwardBtn").onclick = () => {
    if (songs.length < 2) return;
    state.autoPlayNext = false;
    Store.set((d) => {
      const first = d.songs.shift();
      d.songs.push(first);
    });
    render();
  };

  const volSlider = document.getElementById("volSlider");
  if (volSlider) {
    volSlider.oninput = (e) => {
      state.ytVol = parseInt(e.target.value);
      if (state.ytPlayer && state.ytPlayer.setVolume)
        state.ytPlayer.setVolume(state.ytVol);
    };
  }

  document.getElementById("addSongBtn").onclick = () => openSongEditor();

  document.querySelectorAll("[data-sedit]").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const song = songs.find((x) => x.id === btn.dataset.sedit);
      if (song) openSongEditor(song);
    };
  });

  document.querySelectorAll(".song-card").forEach((el) => {
    el.onclick = (e) => {
      if (e.target.closest(".m-del") || e.target.closest(".m-edit")) return;
      const sid = el.dataset.sid;
      const song = songs.find((x) => x.id === sid);
      if (song) {
        state.autoPlayNext = false;
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
        await customDialog("Remove this song?", {
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

export function openSongEditor(songToEdit = null) {
  const isEdit = !!songToEdit;
  const scrim = document.createElement("div");
  scrim.className = "scrim";
  scrim.innerHTML = `
    <div class="dialog">
      <h2>${isEdit ? "Edit Song" : "Add to Playlist"}</h2>
      <div class="field"><label>Song Title</label><input type="text" id="stitle" value="${esc(songToEdit?.title || "")}"></div>
      <div class="field"><label>Artist</label><input type="text" id="sartist" value="${esc(songToEdit?.artist || "")}"></div>
      <div class="field"><label>YouTube Link</label><input type="text" id="syt" value="${esc(songToEdit?.ytUrl || "")}"></div>
      <div class="field"><label>Cover Image</label><input type="file" id="scover" accept="image/*"></div>
      <div class="dialog-actions">
        <button class="btn ghost" onclick="this.closest('.scrim').remove()">Cancel</button>
        <button class="btn" id="saveSongBtn">${isEdit ? "Save Changes" : "Add Song"}</button>
      </div>
    </div>
  `;
  document.body.appendChild(scrim);
  document.getElementById("saveSongBtn").onclick = async () => {
    const title = document.getElementById("stitle").value;
    const artist = document.getElementById("sartist").value;
    const ytUrl = document.getElementById("syt").value;
    const file = document.getElementById("scover").files[0];
    if (!title || !artist) return alert("Please enter title and artist");
    const saveBtn = document.getElementById("saveSongBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
    try {
      let cover = songToEdit
        ? songToEdit.cover
        : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">🎵</text></svg>';
      if (file) cover = await fileToDataURL(file);
      const patch = { title, artist, ytUrl, cover };
      if (isEdit) Store.updateSong(songToEdit.id, patch);
      else Store.addSong(patch);
      scrim.remove();
      render();
    } catch (e) {
      alert("Failed to process image");
      saveBtn.disabled = false;
    }
  };
}
