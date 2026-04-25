import { state } from "./state.js";

export function loadECharts() {
  return new Promise((resolve, reject) => {
    if (window.echarts) return resolve();
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js";
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve();
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
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
  state.worldGeoJSON = null;
}

export async function loadWorldMap() {
  if (state.worldGeoJSON) return;
  try {
    const res = await fetch("https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json");
    state.worldGeoJSON = await res.json();
    if (window.echarts) echarts.registerMap("world", state.worldGeoJSON);
  } catch (e) {
    console.error("Failed to load world map", e);
  }
}
