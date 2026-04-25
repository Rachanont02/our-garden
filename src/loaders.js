import { state } from "./state.js";

let leafletPromise = null;
export function loadLeaflet() {
  if (leafletPromise) return leafletPromise;
  leafletPromise = new Promise((resolve, reject) => {
    if (window.L) return resolve();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return leafletPromise;
}

let echartsPromise = null;

let ytPromise = null;
export function loadYouTubeAPI() {
  if (ytPromise) return ytPromise;
  ytPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve();

    const existing = document.querySelector(
      'script[src*="youtube.com/iframe_api"]',
    );
    const cb = () => {
      if (window.YT && window.YT.Player) resolve();
      else setTimeout(cb, 100);
    };

    if (existing) {
      cb();
    } else {
      window.onYouTubeIframeAPIReady = () => resolve();
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  });
  return ytPromise;
}

export function disposeCharts() {
  try {
    ["map", "miniMap"].forEach((id) => {
      const dom = document.getElementById(id);
      if (dom) {
        // Handle ECharts
        if (window.echarts) {
          const instance = echarts.getInstanceByDom(dom);
          if (instance) instance.dispose();
        }
        // Handle Leaflet (stored on the DOM element for easy access)
        if (dom._leaflet_map) {
          dom._leaflet_map.remove();
          delete dom._leaflet_map;
        }
      }
    });
  } catch (e) {}
}
