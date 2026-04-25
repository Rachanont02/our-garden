import { state } from "./state.js";

let echartsPromise = null;
export function loadECharts() {
  if (echartsPromise) return echartsPromise;
  echartsPromise = new Promise((resolve, reject) => {
    if (window.echarts) return resolve();
    const existing = document.querySelector('script[src*="echarts.min.js"]');
    if (existing) {
      const cb = () => {
        if (window.echarts) resolve();
        else setTimeout(cb, 100);
      };
      cb();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js";
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return echartsPromise;
}

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
      if (dom && window.echarts) {
        const instance = echarts.getInstanceByDom(dom);
        if (instance) instance.dispose();
      }
    });
  } catch (e) {}
}

let worldMapPromise = null;
export function loadWorldMap() {
  if (state.worldGeoJSON) return Promise.resolve();
  if (worldMapPromise) return worldMapPromise;
  worldMapPromise = (async () => {
    try {
      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json",
      );
      state.worldGeoJSON = await res.json();
      if (window.echarts) echarts.registerMap("world", state.worldGeoJSON);
    } catch (e) {
      console.error("Failed to load world map", e);
    }
  })();
  return worldMapPromise;
}
