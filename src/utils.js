import { state } from "./state.js";

export const ICONS = {
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

export const icon = (k) => `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;

export function esc(s) {
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

export function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateLong(iso) {
  if (!iso) return "";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function customDialog(
  msg,
  { isConfirm = false, isDanger = false } = {},
) {
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

export function diffParts(annivDate) {
  const start = new Date(annivDate + "T00:00:00");
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));

  const nextAnniv = new Date(
    now.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  if (nextAnniv < now) nextAnniv.setFullYear(now.getFullYear() + 1);
  const daysUntilAnniv = Math.ceil((nextAnniv - now) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays, daysUntilAnniv };
}

export function parseYouTubeUrl(url) {
  let id = "";
  let start = 0;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      id = u.pathname.slice(1);
      start = parseInt(u.searchParams.get("t")) || 0;
    } else {
      id = u.searchParams.get("v");
      start = parseInt(u.searchParams.get("t")) || 0;
    }
  } catch (e) {
    const m = url.match(/v=([^&]+)/) || url.match(/embed\/([^?]+)/);
    if (m) id = m[1];
  }
  return { id, start };
}

export function fileToDataURL(file, asBlob = false) {
  return new Promise((res, rej) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const MAX_DIM = isIOS ? 1000 : 1280;
    const MAX_SIZE = isIOS ? 250 * 1024 : 400 * 1024;
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

      let quality = 0.85;
      const format = "image/jpeg";

      const getResult = () => {
        if (asBlob) {
          canvas.toBlob((blob) => res(blob), format, quality);
        } else {
          let dataUrl = canvas.toDataURL(format, quality);
          // Simple heuristic to stay under limit
          if (dataUrl.length > MAX_SIZE && quality > 0.4) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL(format, quality);
          }
          res(dataUrl);
        }
      };
      getResult();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = () => rej(r.error);
      r.readAsDataURL(file);
    };
    img.src = url;
  });
}
