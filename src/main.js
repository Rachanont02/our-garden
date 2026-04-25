import { state } from "./state.js";
import { disposeCharts } from "./loaders.js";
import { renderDebugPanel } from "./components.js";
import { renderLogin } from "./pages/login.js";
import { renderHome } from "./pages/home.js";
import { renderGallery } from "./pages/gallery.js";
import { renderLetters } from "./pages/letters.js";
import { renderMap } from "./pages/map.js";
import { renderPlaylist } from "./pages/playlist.js";

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

// --- Routing ---
export function currentRoute() {
  const h = location.hash.replace("#/", "") || "home";
  const [path, ...rest] = h.split("/");
  return { path, params: rest };
}

window.addEventListener("hashchange", render);

function hideSkeleton() {
  const sl = document.getElementById("skeletonLoader");
  if (sl && !sl.classList.contains("hidden")) {
    setTimeout(() => sl.classList.add("hidden"), 500);
    setTimeout(() => sl.remove(), 1000);
  }
}

export async function render() {
  const route = currentRoute();
  Store.log("debug", "Rendering route: " + route.path);
  disposeCharts();
  if (state.ytPlayer) {
    try {
      state.ytPlayer.destroy();
    } catch (e) {}
    state.ytPlayer = null;
    state.ytState = -1;
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
      await renderMap();
      break;
    case "playlist":
      await renderPlaylist();
      break;
    default:
      location.hash = "#/home";
  }
  hideSkeleton();
}

// Initial boot
window.state = state;
Store.init().then(() => {
  render();
  renderDebugPanel();
});
