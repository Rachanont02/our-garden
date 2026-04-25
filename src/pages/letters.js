import { state } from "../state.js";
import { esc, fmtDate, fmtDateLong, customDialog } from "../utils.js";
import { topbar, menu, wireTopbar } from "../components.js";
import { render } from "../main.js";

export function renderLetters() {
  const d = Store.get();
  state.root.innerHTML = `
    ${topbar()}
    <div class="page">
      ${menu("letters")}
      <div class="page-header" style="text-align:center">
        <div class="eyebrow">Love Notes</div>
        <h1 class="page-title">Letters, <em>for you</em></h1>
        <div class="page-sub">softly folded, kept in the drawer</div>
      </div>
      <div class="letters-grid">
        ${d.letters.map((l) => `
          <div class="envelope ${esc(l.color || "peach")}" data-letter="${esc(l.id)}">
            <div class="env-flap"></div>
            <div class="env-seal">♡</div>
            <div class="env-to">to ${esc(l.to || "you")}</div>
            <div class="env-meta">
              <div class="env-date">${esc(fmtDate(l.date))}</div>
              <div class="env-title">${esc(l.title || "a little note")}</div>
            </div>
          </div>
        `).join("")}
        <div class="envelope add" id="addLetterBtn">
          <div style="text-align:center"><span>+</span><div>write a new note</div></div>
        </div>
      </div>
      ${d.letters.length === 0 ? '<div class="empty" style="grid-column:1/-1"><span class="leaf">❦</span>no letters yet</div>' : ""}
    </div>
  `;
  wireTopbar();
  document.getElementById("addLetterBtn").onclick = () => openLetterEditor();
  state.root.querySelectorAll("[data-letter]").forEach((el) => {
    el.onclick = () => {
      state.openLetter = el.dataset.letter;
      render();
    };
  });
  if (state.openLetter) showLetterDialog();
}

export function showLetterDialog() {
  const d = Store.get();
  const l = d.letters.find((x) => x.id === state.openLetter);
  if (!l) { state.openLetter = null; return; }
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
  scrim.addEventListener("click", (e) => { if (e.target === scrim) { state.openLetter = null; scrim.remove(); } });
  scrim.querySelector("[data-close]").onclick = () => { state.openLetter = null; scrim.remove(); };
  scrim.querySelector("[data-edit]").onclick = () => { scrim.remove(); openLetterEditor(l); };
}

export function openLetterEditor(letter) {
  const isEdit = !!letter;
  const l = letter || {
    from: Store.get().couple.name1 || "",
    to: Store.get().couple.name2 || "",
    title: "", body: "", color: "peach",
    date: new Date().toISOString().slice(0, 10),
  };
  const scrim = document.createElement("div");
  scrim.className = "scrim";
  scrim.innerHTML = `
    <div class="dialog">
      <h2>${isEdit ? "Edit note" : "A new note"}</h2>
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
  scrim.querySelectorAll(".sw").forEach((sw) => sw.onclick = () => {
    color = sw.dataset.color;
    scrim.querySelectorAll(".sw").forEach((s) => s.classList.toggle("active", s === sw));
  });
  scrim.querySelector("[data-cancel]").onclick = () => scrim.remove();
  scrim.querySelector("[data-save]").onclick = () => {
    const patch = {
      title: document.getElementById("ltitle").value.trim() || "a little note",
      from: document.getElementById("lfrom").value.trim(),
      to: document.getElementById("lto").value.trim(),
      date: document.getElementById("ldate").value,
      body: document.getElementById("lbody").value,
      color,
    };
    if (isEdit) Store.updateLetter(l.id, patch); else Store.addLetter(patch);
    scrim.remove(); state.openLetter = null; render();
  };
  if (isEdit) {
    scrim.querySelector("[data-del]").onclick = async () => {
      if (await customDialog("Delete this note?", { isConfirm: true, isDanger: true })) {
        Store.removeLetter(l.id); scrim.remove(); state.openLetter = null; render();
      }
    };
  }
}
