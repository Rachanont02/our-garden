import { state } from "../state.js";
import {
  esc,
  icon,
  fmtDate,
  fmtDateLong,
  customDialog,
  fileToDataURL,
} from "../utils.js";
import { topbar, menu, wireTopbar } from "../components.js";
import { render } from "../main.js";

export function renderGallery() {
  const d = Store.get();
  const q = state.gallerySearch.toLowerCase();
  const photos = d.photos.filter(
    (p) =>
      !p.placeId &&
      (!q ||
        (p.caption || "").toLowerCase().includes(q) ||
        (p.date || "").includes(q)),
  );

  state.root.innerHTML = `
    ${topbar()}
    <div class="page">
      ${menu("gallery")}
      <div class="page-header" style="text-align:center">
        <div class="eyebrow">Our Gallery</div>
        <h1 class="page-title">Moments, <em>remembered</em></h1>
        <div class="page-sub">every quiet thing, kept</div>
      </div>
      <div class="gallery-toolbar">
        <div class="search-box">${icon("search")}<input type="text" placeholder="search..." id="gsearch" value="${esc(state.gallerySearch)}"></div>
        <div style="display:flex;gap:8px">
          ${state.isSelectMode ? `<button class="btn soft" id="cancelSelect">Cancel</button><button class="btn" id="bulkDeleteBtn" style="background:#a86060;border-color:#a86060">${icon("trash")} Delete (${state.selectedPhotos.length})</button>` : `<button class="btn soft" id="startSelect">${icon("heart")} Select</button><button class="btn" id="addPhotoBtn">${icon("plus")} Add photo</button>`}
        </div>
      </div>
      ${
        photos.length === 0
          ? `<div class="empty"><span class="leaf">❦</span>${state.gallerySearch ? "no moments match that" : "no photos yet"}</div>`
          : `
        <div class="masonry ${state.isSelectMode ? "select-mode" : ""}">
          ${photos
            .map((p) => {
              const isSel = state.selectedPhotos.includes(p.id);
              return `
              <div class="m-item ${isSel ? "selected" : ""}" data-photo="${esc(p.id)}">
                ${p.url ? `<img src="${esc(p.url)}" alt="${esc(p.caption || "")}" loading="lazy">` : `<div class="m-ph">photo placeholder</div>`}
                <div class="m-sel-check">${isSel ? "✓" : ""}</div>
                ${!state.isSelectMode ? `<button class="m-del" data-del="${esc(p.id)}" title="Remove">×</button>` : ""}
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
      state.isSelectMode = true;
      state.selectedPhotos = [];
      renderGallery();
    };

  const cancelSel = document.getElementById("cancelSelect");
  if (cancelSel)
    cancelSel.onclick = () => {
      state.isSelectMode = false;
      state.selectedPhotos = [];
      renderGallery();
    };

  const bulkDel = document.getElementById("bulkDeleteBtn");
  if (bulkDel && state.selectedPhotos.length > 0) {
    bulkDel.onclick = async () => {
      if (
        await customDialog(`Delete ${state.selectedPhotos.length} photos?`, {
          isConfirm: true,
          isDanger: true,
        })
      ) {
        state.selectedPhotos.forEach((id) => Store.removePhoto(id));
        state.selectedPhotos = [];
        state.isSelectMode = false;
        renderGallery();
      }
    };
  }

  document.getElementById("gsearch").oninput = (e) => {
    state.gallerySearch = e.target.value;
    renderGallery();
  };

  state.root.querySelectorAll("[data-photo]").forEach((el) => {
    el.onclick = (e) => {
      if (e.target.matches("[data-del]")) return;
      const id = el.dataset.photo;
      if (state.isSelectMode) {
        const check = el.querySelector(".m-sel-check");
        if (state.selectedPhotos.includes(id)) {
          state.selectedPhotos = state.selectedPhotos.filter((x) => x !== id);
          el.classList.remove("selected");
          if (check) check.textContent = "";
        } else {
          state.selectedPhotos.push(id);
          el.classList.add("selected");
          if (check) check.textContent = "✓";
        }
        const bulkBtn = document.getElementById("bulkDeleteBtn");
        if (bulkBtn)
          bulkBtn.innerHTML = `${icon("trash")} Delete (${state.selectedPhotos.length})`;
      } else {
        const p = Store.get().photos.find((x) => x.id === id);
        if (p) showLightbox(p);
      }
    };
  });

  state.root.querySelectorAll("[data-del]").forEach((b) => {
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

export function openPhotoEditor(photo) {
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
      <div class="field"><label>Image URL</label><input id="purl" value="${esc(p.url)}"></div>
      <div class="field"><label>Or upload</label><input type="file" id="pfile" accept="image/*" multiple></div>
      <div class="field"><label>Caption</label><input id="pcap" value="${esc(p.caption)}"></div>
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
        if (url) Store.addPhoto({ url, caption, date });
        for (let i = 0; i < files.length; i++) {
          const dataUrl = await fileToDataURL(files[i]);
          Store.addPhoto({ url: dataUrl, caption, date });
        }
      }
      document.body.classList.remove("no-scroll");
      scrim.remove();
      render();
    } catch (err) {
      alert(err.message);
      saveBtn.textContent = "Save";
      saveBtn.disabled = false;
    }
  };
}

export function showLightbox(p) {
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
      await customDialog("Delete this memory?", {
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
