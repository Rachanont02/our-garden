import { state } from "../state.js";
import { esc, icon, fmtDate, fmtDateLong, customDialog, fileToDataURL } from "../utils.js";
import { topbar, menu, wireTopbar } from "../components.js";
import { loadECharts, loadWorldMap, disposeCharts } from "../loaders.js";
import { render } from "../main.js";
import { showLightbox } from "./gallery.js";

export async function renderMap() {
  const d = Store.get();
  state.root.innerHTML = `
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
          ${d.places.length === 0 ? `<div class="empty" style="padding:40px 20px"><span class="leaf">❦</span>no places yet</div>` : d.places.sort((a, b) => new Date(b.date) - new Date(a.date)).map((p) => `
            <div class="place-item" data-place="${esc(p.id)}">
              <h4>${esc(p.name)}</h4>
              <div class="pd">${esc(fmtDate(p.date))}</div>
              <div class="pcount">${(p.photos || []).length + d.photos.filter((x) => x.placeId === p.id).length} photos →</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
  wireTopbar();
  document.getElementById("addPlaceBtn").onclick = () => openPlaceEditor();

  await loadECharts();
  if (!window.echarts) {
    state.root.querySelector("#map").innerHTML = '<div class="empty"><span class="leaf">❦</span>Map failed to load.</div>';
    return;
  }
  await loadWorldMap();
  if (state.worldGeoJSON && window.echarts) echarts.registerMap("world", state.worldGeoJSON);
  const chartDom = document.getElementById("map");
  if (!chartDom) return;
  const myChart = echarts.init(chartDom);
  const sortedPlaces = [...d.places].sort((a, b) => new Date(a.date) - new Date(b.date)).filter((p) => typeof p.lng === "number" && typeof p.lat === "number");
  const scatterData = sortedPlaces.map((p) => ({ name: p.name, value: [p.lng, p.lat, p.id], date: p.date }));
  const osloCoord = [10.75, 59.91];
  const linesData = sortedPlaces.filter((p) => Math.sqrt(Math.pow(p.lng - osloCoord[0], 2) + Math.pow(p.lat - osloCoord[1], 2)) > 0.5).map((p) => ({ coords: [osloCoord, [p.lng, p.lat]] }));

  myChart.setOption({
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: (p) => {
        if (p.seriesType !== "scatter") return "";
        const fallback = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="106"><rect width="160" height="106" fill="%23f2f4ec"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">📍</text></svg>';
        return `
          <div style="text-align:center; width: 160px;">
            <img src="${fallback}" style="width: 160px; height: 106px; object-fit: cover; display: block; margin-bottom: 12px; background: #eee; border-radius: 4px;">
            <div style="font-family:serif; font-weight: 600; font-size: 16px; color:#2a3625;">${p.name}</div>
            <div style="font-size: 11px; color:#7a8a60; margin-top: 4px;">${fmtDate(p.data.date)}</div>
          </div>`;
      },
      backgroundColor: "#ffffff", padding: [8, 8, 16, 8],
    },
    geo: { map: "world", roam: true, itemStyle: { areaColor: "#2b3626", borderColor: "#4a5838" } },
    series: [
      { type: "scatter", coordinateSystem: "geo", data: scatterData, symbol: "pin", symbolSize: 18, symbolOffset: [0, "-50%"], itemStyle: { color: "#e6b99a" } },
      { type: "lines", coordinateSystem: "geo", data: linesData, lineStyle: { color: "#ffffff", width: 1, opacity: 0.4, curveness: 0.3, type: "dashed" } },
      { type: "scatter", coordinateSystem: "geo", data: [{ name: "Home 🏠", value: [10.75, 59.91] }], symbol: "pin", symbolSize: 26, symbolOffset: [0, "-50%"], itemStyle: { color: "#e05a5a" }, label: { show: true, formatter: "🏠", fontSize: 10 }, silent: true }
    ],
  });

  myChart.on("click", (params) => {
    if (params.componentType === "series" && params.seriesType === "scatter") {
      const p = Store.get().places.find((x) => x.id === params.data.value[2]);
      if (p) { state.openPlaceId = p.id; render(); }
    }
  });

  state.root.querySelectorAll(".place-item").forEach((el) => {
    el.onclick = () => { state.openPlaceId = el.dataset.place; render(); };
  });

  window.addEventListener("resize", () => myChart && myChart.resize());
  if (state.openPlaceId) showPlaceDialog();
}

export function showPlaceDialog(initialScroll = 0) {
  const d = Store.get();
  const p = d.places.find((x) => x.id === state.openPlaceId);
  if (!p) { state.openPlaceId = null; return; }
  const pPhotos = d.photos.filter((x) => x.placeId === p.id);
  const legacyPhotos = p.photos || [];

  const scrim = document.createElement("div");
  scrim.className = "scrim";
  scrim.innerHTML = `
    <div class="dialog" style="max-width:680px">
      <div class="dialog-header">
        <div class="header-left">
          <div class="eyebrow">${esc(fmtDateLong(p.date))}</div>
          <h2 style="margin:0">${esc(p.name)}</h2>
        </div>
        <div style="display:flex;gap:8px">
          ${state.isSelectMode ? `
            <button class="btn" id="bulkDeletePlaceBtn" style="background:#a86060">${icon("trash")} Delete (${state.selectedPhotos.length})</button>
            <button class="btn soft" id="startPlaceSelect">Cancel</button>
          ` : `
            <button class="btn soft" id="startPlaceSelect">${icon("heart")} Select</button>
            <button class="icon-btn close-dialog" data-close>×</button>
          `}
        </div>
      </div>
      ${p.note ? `<div class="place-note">${esc(p.note)}</div>` : ""}
      <div class="place-photos ${state.isSelectMode ? "select-mode" : ""}">
        ${legacyPhotos.map((src, i) => {
          const id = `legacy-${i}`;
          const isSel = state.selectedPhotos.includes(id);
          return `<div class="pp ${isSel ? "selected" : ""}" data-ppi="${id}"><img src="${esc(src)}"><div class="m-sel-check">${isSel ? "✓" : ""}</div>${!state.isSelectMode ? `<button class="m-del" data-legacy-ppdel="${i}">×</button>` : ""}</div>`;
        }).join("")}
        ${pPhotos.map((ph) => {
          const isSel = state.selectedPhotos.includes(ph.id);
          return `<div class="pp ${isSel ? "selected" : ""}" data-ppid="${esc(ph.id)}"><img src="${esc(ph.url)}"><div class="m-sel-check">${isSel ? "✓" : ""}</div>${!state.isSelectMode ? `<button class="m-del" data-ppdel="${esc(ph.id)}">×</button>` : ""}</div>`;
        }).join("")}
        ${!state.isSelectMode ? `<div class="pp-add" id="addPP">+</div>` : ""}
      </div>
      <div class="dialog-footer">
        <button class="btn ghost" data-edit>Edit details</button>
        <button class="btn" data-close>Done</button>
      </div>
    </div>
  `;
  document.body.appendChild(scrim);
  if (initialScroll) scrim.querySelector(".dialog").scrollTop = initialScroll;
  document.body.classList.add("no-scroll");
  scrim.addEventListener("click", (e) => { if (e.target === scrim) { state.openPlaceId = null; document.body.classList.remove("no-scroll"); scrim.remove(); } });
  scrim.querySelectorAll("[data-close]").forEach((b) => b.onclick = () => { state.openPlaceId = null; document.body.classList.remove("no-scroll"); scrim.remove(); });
  scrim.querySelector("[data-edit]").onclick = () => { state.isSelectMode = false; state.selectedPhotos = []; document.body.classList.remove("no-scroll"); scrim.remove(); openPlaceEditor(p); };
  
  const startBtn = scrim.querySelector("#startPlaceSelect");
  if (startBtn) startBtn.onclick = () => {
    const currentScroll = scrim.querySelector(".dialog").scrollTop;
    state.isSelectMode = !state.isSelectMode;
    state.selectedPhotos = []; scrim.remove(); showPlaceDialog(currentScroll);
  };

  const bulkBtn = scrim.querySelector("#bulkDeletePlaceBtn");
  if (bulkBtn && state.selectedPhotos.length > 0) {
    bulkBtn.onclick = async () => {
      if (await customDialog(`Delete ${state.selectedPhotos.length} photos?`, { isConfirm: true, isDanger: true })) {
        const nextLegacy = [...legacyPhotos];
        const legacyToDelete = state.selectedPhotos.filter((id) => id.startsWith("legacy-")).map((id) => parseInt(id.split("-")[1])).sort((a, b) => b - a);
        legacyToDelete.forEach((idx) => nextLegacy.splice(idx, 1));
        if (legacyToDelete.length > 0) Store.updatePlace(p.id, { photos: nextLegacy });
        state.selectedPhotos.filter((id) => !id.startsWith("legacy-")).forEach((id) => Store.removePhoto(id));
        state.selectedPhotos = []; state.isSelectMode = false; scrim.remove(); showPlaceDialog();
      }
    };
  }

  const addPP = scrim.querySelector("#addPP");
  if (addPP) addPP.onclick = () => addPhotoToPlace(p.id);

  scrim.querySelectorAll(".pp").forEach((el) => {
    el.onclick = (e) => {
      if (e.target.matches("[data-legacy-ppdel], [data-ppdel]")) return;
      const id = el.dataset.ppid || el.dataset.ppi;
      if (state.isSelectMode) {
        const check = el.querySelector(".m-sel-check");
        if (state.selectedPhotos.includes(id)) {
          state.selectedPhotos = state.selectedPhotos.filter((x) => x !== id);
          el.classList.remove("selected"); if (check) check.textContent = "";
        } else {
          state.selectedPhotos.push(id);
          el.classList.add("selected"); if (check) check.textContent = "✓";
        }
      } else {
        if (el.dataset.ppid) {
          const ph = Store.get().photos.find((x) => x.id === el.dataset.ppid);
          if (ph) showLightbox(ph);
        } else {
          showLightbox({ url: legacyPhotos[parseInt(el.dataset.ppi.split("-")[1])], caption: p.name, date: p.date });
        }
      }
    };
  });
}

export function addPhotoToPlace(placeId) {
  const scrim = document.createElement("div");
  scrim.className = "scrim";
  scrim.innerHTML = `
    <div class="dialog">
      <h2>Add a photo</h2>
      <div class="field"><label>Image URL</label><input id="purl"></div>
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
    if (!url && files.length === 0) { alert("add a URL or select files first"); return; }
    const saveBtn = scrim.querySelector("[data-save]");
    saveBtn.textContent = "Adding..."; saveBtn.disabled = true;
    try {
      const place = Store.get().places.find((x) => x.id === placeId);
      if (url) Store.addPhoto({ url, caption: place.name, date: place.date, placeId: place.id });
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await fileToDataURL(files[i]);
        Store.addPhoto({ url: dataUrl, caption: place.name, date: place.date, placeId: place.id });
      }
      scrim.remove(); render();
    } catch (err) { alert(err.message); saveBtn.textContent = "Add"; saveBtn.disabled = false; }
  };
}

export function openPlaceEditor(place) {
  const isEdit = !!place;
  const p = place || { name: "", note: "", lat: "", lng: "", date: new Date().toISOString().slice(0, 10), photos: [] };
  const scrim = document.createElement("div");
  scrim.className = "scrim";
  scrim.innerHTML = `
    <div class="dialog">
      <h2>${isEdit ? "Edit place" : "A new place"}</h2>
      <div class="field"><label>Name</label><input id="nname" value="${esc(p.name)}"></div>
      <div class="field"><label>Date</label><input type="date" id="ndate" value="${esc(p.date)}"></div>
      <div class="field"><label>Note</label><textarea id="nnote">${esc(p.note)}</textarea></div>
      <div style="display:none"><input id="nlat" value="${esc(p.lat)}"><input id="nlng" value="${esc(p.lng)}"></div>
      <div class="field">
        <label>Location</label>
        <div style="display:flex;gap:8px;margin-bottom:8px"><input id="locSearch" style="flex:1"><button class="btn soft" id="locSearchBtn">Search</button></div>
        <div id="miniMap" style="height:220px;border-radius:8px;border:1px solid #d9dcd0"></div>
      </div>
      <div class="dialog-actions">
        ${isEdit ? '<button class="btn soft" data-del style="color:#a86060">Delete</button>' : ""}
        <button class="btn ghost" data-cancel>Cancel</button>
        <button class="btn" data-save>Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(scrim);

  let miniChart;
  setTimeout(async () => {
    await loadECharts();
    await loadWorldMap();
    const dom = document.getElementById("miniMap");
    if (!dom) return;
    miniChart = echarts.init(dom);
    const lat = parseFloat(p.lat) || 20;
    const lng = parseFloat(p.lng) || 0;
    const update = (mlat, mlng) => {
      miniChart.setOption({
        backgroundColor: "#1a2118", geo: { map: "world", roam: true, center: [mlng, mlat], zoom: p.lat ? 5 : 1.2 },
        series: [{ type: "scatter", coordinateSystem: "geo", data: [[mlng, mlat]], symbol: "pin", symbolSize: 18, itemStyle: { color: "#e6b99a" } }]
      });
    };
    update(lat, lng);
    miniChart.getZr().on("click", (e) => {
      const coord = miniChart.convertFromPixel("geo", [e.offsetX, e.offsetY]);
      if (coord) {
        document.getElementById("nlng").value = coord[0].toFixed(6);
        document.getElementById("nlat").value = coord[1].toFixed(6);
        update(coord[1], coord[0]);
      }
    });
  }, 50);

  scrim.querySelector("#locSearchBtn").onclick = async () => {
    const q = document.getElementById("locSearch").value.trim();
    if (!q) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat); const lng = parseFloat(data[0].lon);
        document.getElementById("nlat").value = lat.toFixed(6); document.getElementById("nlng").value = lng.toFixed(6);
        if (miniChart) miniChart.setOption({ geo: { center: [lng, lat], zoom: 5 }, series: [{ data: [[lng, lat]] }] });
      }
    } catch (err) { alert("Search failed"); }
  };

  scrim.querySelector("[data-cancel]").onclick = () => scrim.remove();
  scrim.querySelector("[data-save]").onclick = async () => {
    const patch = { name: document.getElementById("nname").value.trim(), note: document.getElementById("nnote").value.trim(), date: document.getElementById("ndate").value, lat: parseFloat(document.getElementById("nlat").value), lng: parseFloat(document.getElementById("nlng").value) };
    if (isEdit) Store.updatePlace(p.id, patch); else Store.addPlace(patch);
    scrim.remove(); state.openPlaceId = null; render();
  };
  if (isEdit) {
    scrim.querySelector("[data-del]").onclick = async () => {
      if (await customDialog("Delete this place?", { isConfirm: true, isDanger: true })) {
        Store.removePlace(p.id); scrim.remove(); state.openPlaceId = null; render();
      }
    };
  }
}
