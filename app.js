// Sage Garden · app
(function(){
  const root = document.getElementById('root');
  let adminOpen = false;
  let lightboxSrc = null;
  let openLetter = null;
  let openPlaceId = null;
  let mapInstance = null;
  let mapMarkers = [];
  let gallerySearch = '';
  
  let worldGeoJSON = null;
  async function loadWorldMap() {
    if (worldGeoJSON) return;
    try {
      const res = await fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json');
      worldGeoJSON = await res.json();
      echarts.registerMap('world', worldGeoJSON);
    } catch(e) {
      console.error('Failed to load world map', e);
    }
  }

  // --- Custom Dialog ---
  window.alert = (msg) => customDialog(msg, { isConfirm: false });
  function customDialog(msg, { isConfirm = false, isDanger = false } = {}) {
    return new Promise(resolve => {
      const scrim = document.createElement('div');
      scrim.className = 'scrim';
      scrim.style.zIndex = '9999';
      scrim.innerHTML = `
        <div class="dialog" style="max-width:380px;text-align:center;padding:34px 24px;">
          <div class="leaf-decor" style="font-size:32px;margin-bottom:12px;opacity:0.8;">❦</div>
          <div class="dsub" style="font-size:17px;color:var(--ink);margin-bottom:28px;">${esc(msg)}</div>
          <div class="dialog-actions" style="justify-content:center;gap:12px">
            ${isConfirm ? `<button class="btn ghost" data-c>Cancel</button>` : ''}
            <button class="btn" data-o style="${isDanger ? 'background:#a86060;border-color:#a86060' : ''}">${isConfirm ? (isDanger ? 'Delete' : 'Yes') : 'OK'}</button>
          </div>
        </div>
      `;
      document.body.appendChild(scrim);
      const close = (val) => { scrim.remove(); resolve(val); };
      if (isConfirm) scrim.querySelector('[data-c]').onclick = () => close(false);
      scrim.querySelector('[data-o]').onclick = () => close(true);
    });
  }

  // --- Routing (hash-based) ---
  function currentRoute(){
    const h = location.hash.replace('#/','') || 'home';
    const [path, ...rest] = h.split('/');
    return { path, params: rest };
  }
  window.addEventListener('hashchange', render);

  // --- Icons ---
  const ICONS = {
    heart:'<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
    photo:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 17-5-5-9 9"/>',
    letter:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    map:'<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16M15 5v16"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    trash:'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    upload:'<path d="M12 21V9m-4 4 4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>'
  };
  const icon = (k) => `<svg viewBox="0 0 24 24">${ICONS[k]}</svg>`;

  // --- Utils ---
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function fmtDate(iso){
    if (!iso) return '';
    const d = new Date(iso + (iso.length===10?'T00:00:00':''));
    return d.toLocaleDateString('en-US',{month:'short', day:'numeric', year:'numeric'});
  }
  function fmtDateLong(iso){
    if (!iso) return '';
    const d = new Date(iso + (iso.length===10?'T00:00:00':''));
    return d.toLocaleDateString('en-US',{weekday:'long', month:'long', day:'numeric', year:'numeric'});
  }

  // --- Top bar ---
  function topbar(){
    const d = Store.get();
    return `
    <div class="topbar">
      <div class="brand">${esc(d.couple.name1||'you')} <span class="brand-dot"></span> <em>${esc(d.couple.name2||'me')}</em></div>
      <div class="topbar-right">
        <button class="icon-btn" id="adminBtn" title="Manage content">${icon('settings')}</button>
        <button class="icon-btn" id="lockBtn" title="Lock">${icon('lock')}</button>
      </div>
    </div>`;
  }

  // --- Menu ---
  function menu(active){
    const items = [
      ['home','Home'],
      ['gallery','Gallery'],
      ['letters','Love Notes'],
      ['map','Our Map']
    ];
    return `<nav class="menu-nav">${items.map(([k,l])=>`<a href="#/${k}" class="${active===k?'active':''}">${l}</a>`).join('')}</nav>`;
  }

  // ---------- LOGIN ----------
  function renderLogin(){
    root.innerHTML = `
    <div class="login-wrap">
      <div class="login-card">
        <div class="leaf-decor">❦</div>
        <h1>Our <em>little</em> garden</h1>
        <div class="sub">— a private place, just for us —</div>
        <form id="loginForm">
          <input type="password" class="pwd-input" id="pwd" placeholder="• • • • • • • •" autocomplete="off" autofocus>
          <div class="err" id="err"></div>
          <div class="pwd-hint">the day we began (ddmmyyyy)</div>
          <button type="submit" class="btn" style="margin-top:26px;width:100%;justify-content:center">Enter</button>
        </form>
        <div class="login-foot">EST. ${fmtDate(Store.get().couple.anniversary).toUpperCase()}</div>
      </div>
    </div>`;
    document.getElementById('loginForm').addEventListener('submit', e => {
      e.preventDefault();
      const entered = document.getElementById('pwd').value.replace(/\D/g,'');
      const anniv = Store.get().couple.anniversary; // YYYY-MM-DD
      const [y,m,dy] = anniv.split('-');
      const expected = `${dy}${m}${y}`; // ddmmyyyy
      const expectedAlt = `${y}${m}${dy}`; // yyyymmdd (be forgiving)
      const expectedAlt2 = `${dy}${m}${y.slice(2)}`; // ddmmyy
      if (entered === expected || entered === expectedAlt || entered === expectedAlt2){
        Store.unlock();
        location.hash = '#/home';
        render();
      } else {
        document.getElementById('err').textContent = 'not quite — try the date we began';
        document.getElementById('pwd').value = '';
      }
    });
  }

  // ---------- HOME ----------
  function renderHome(){
    const d = Store.get();
    const p = diffParts(d.couple.anniversary);
    root.innerHTML = `
      ${topbar()}
      <div class="page">
        ${menu('home')}
        <div class="home-hero">
          <div class="home-motto">${esc(d.couple.motto)}</div>
          <h1 class="home-title">${esc(d.couple.name1||'us')} <em>&amp;</em> ${esc(d.couple.name2||'us')}</h1>
        </div>
        <div class="counter-row">
          <div class="c-cell"><div class="c-num">${p.years}</div><div class="c-lbl">year${p.years===1?'':'s'}</div><div class="c-corner"></div></div>
          <div class="c-cell"><div class="c-num">${p.months}</div><div class="c-lbl">month${p.months===1?'':'s'}</div><div class="c-corner"></div></div>
          <div class="c-cell"><div class="c-num">${p.days}</div><div class="c-lbl">day${p.days===1?'':'s'}</div><div class="c-corner"></div></div>
        </div>
        <div class="total-row">
          <div class="total-cell"><span class="k">Since we began</span><span class="v">${p.totalDays.toLocaleString()} days</span></div>
          <div class="total-cell"><span class="k">Next anniversary in</span><span class="v">${p.daysUntilAnniv} days</span></div>
        </div>
        <div class="quick-grid">
          <a href="#/gallery" class="q-card">
            <div class="qico">${icon('photo')}</div>
            <h3>Our Gallery</h3>
            <div class="qd">every moment, kept close</div>
            <div class="qc"><span>${d.photos.length} photo${d.photos.length===1?'':'s'}</span><span class="qarr">→</span></div>
          </a>
          <a href="#/letters" class="q-card">
            <div class="qico">${icon('letter')}</div>
            <h3>Love Notes</h3>
            <div class="qd">sealed words, softly folded</div>
            <div class="qc"><span>${d.letters.length} letter${d.letters.length===1?'':'s'}</span><span class="qarr">→</span></div>
          </a>
          <a href="#/map" class="q-card">
            <div class="qico">${icon('map')}</div>
            <h3>Our Map</h3>
            <div class="qd">places we've been together</div>
            <div class="qc"><span>${d.places.length} place${d.places.length===1?'':'s'}</span><span class="qarr">→</span></div>
          </a>
        </div>
      </div>
    `;
    wireTopbar();
  }

  // ---------- LETTERS ----------
  function renderLetters(){
    const d = Store.get();
    root.innerHTML = `
      ${topbar()}
      <div class="page">
        ${menu('letters')}
        <div class="page-header" style="text-align:center">
          <div class="eyebrow">Love Notes</div>
          <h1 class="page-title">Letters, <em>for you</em></h1>
          <div class="page-sub">softly folded, kept in the drawer</div>
        </div>
        <div class="letters-grid">
          ${d.letters.map(l => `
            <div class="envelope ${esc(l.color||'peach')}" data-letter="${esc(l.id)}">
              <div class="env-flap"></div>
              <div class="env-seal">♡</div>
              <div class="env-to">to ${esc(l.to||'you')}</div>
              <div class="env-meta">
                <div class="env-date">${esc(fmtDate(l.date))}</div>
                <div class="env-title">${esc(l.title||'a little note')}</div>
              </div>
            </div>
          `).join('')}
          <div class="envelope add" id="addLetterBtn">
            <div style="text-align:center">
              <span>+</span>
              <div>write a new note</div>
            </div>
          </div>
        </div>
        ${d.letters.length===0?'<div class="empty" style="grid-column:1/-1"><span class="leaf">❦</span>no letters yet — tap the card above to write one</div>':''}
      </div>
    `;
    wireTopbar();
    document.getElementById('addLetterBtn').onclick = () => openLetterEditor();
    root.querySelectorAll('[data-letter]').forEach(el => {
      el.onclick = () => { openLetter = el.dataset.letter; render(); };
    });
    if (openLetter) showLetterDialog();
  }

  function showLetterDialog(){
    const d = Store.get();
    const l = d.letters.find(x => x.id === openLetter);
    if (!l){ openLetter = null; return; }
    const scrim = document.createElement('div');
    scrim.className = 'scrim letter-scrim';
    scrim.innerHTML = `
      <div class="dialog" role="dialog">
        <div class="letter-head">
          <div class="ld">${esc(fmtDateLong(l.date))}</div>
          <div class="ld">${esc(l.from||'')}</div>
        </div>
        <div class="letter-to">Dear <em>${esc(l.to||'you')}</em>,</div>
        <div class="letter-body">${esc(l.body||'')}</div>
        <div class="letter-sign">— always, ${esc(l.from||'yours')}</div>
        <div class="letter-actions">
          <button class="btn ghost" data-edit>Edit</button>
          <button class="btn soft" data-close>Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    scrim.addEventListener('click', e => { if(e.target===scrim){ openLetter = null; scrim.remove(); }});
    scrim.querySelector('[data-close]').onclick = () => { openLetter=null; scrim.remove(); };
    scrim.querySelector('[data-edit]').onclick = () => { scrim.remove(); openLetterEditor(l); };
  }

  function openLetterEditor(letter){
    const isEdit = !!letter;
    const l = letter || { from:Store.get().couple.name1||'', to:Store.get().couple.name2||'', title:'', body:'', color:'peach', date:new Date().toISOString().slice(0,10) };
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.innerHTML = `
      <div class="dialog">
        <h2>${isEdit?'Edit note':'A new note'}</h2>
        <div class="dsub">${isEdit?'change what needs changing':'write whatever your heart needs to say'}</div>
        <div class="field"><label>Title</label><input id="ltitle" value="${esc(l.title)}" placeholder="a little note"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="field"><label>From</label><input id="lfrom" value="${esc(l.from)}"></div>
          <div class="field"><label>To</label><input id="lto" value="${esc(l.to)}"></div>
        </div>
        <div class="field"><label>Date</label><input type="date" id="ldate" value="${esc(l.date)}"></div>
        <div class="field"><label>Letter</label><textarea id="lbody" placeholder="write from the heart...">${esc(l.body)}</textarea></div>
        <div class="field"><label>Envelope color</label>
          <div class="color-swatches" id="swatches">
            ${['peach','sage','blush','sand','lavender'].map(c=>`<div class="sw ${c} ${l.color===c?'active':''}" data-color="${c}"></div>`).join('')}
          </div>
        </div>
        <div class="dialog-actions">
          ${isEdit?'<button class="btn soft" data-del style="margin-right:auto;color:#a86060">Delete</button>':''}
          <button class="btn ghost" data-cancel>Cancel</button>
          <button class="btn" data-save>${isEdit?'Save':'Seal it'}</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    let color = l.color;
    scrim.querySelectorAll('.sw').forEach(sw => sw.onclick = () => {
      color = sw.dataset.color;
      scrim.querySelectorAll('.sw').forEach(s => s.classList.toggle('active', s===sw));
    });
    scrim.querySelector('[data-cancel]').onclick = () => scrim.remove();
    scrim.querySelector('[data-save]').onclick = () => {
      const patch = {
        title: document.getElementById('ltitle').value.trim() || 'a little note',
        from:  document.getElementById('lfrom').value.trim(),
        to:    document.getElementById('lto').value.trim(),
        date:  document.getElementById('ldate').value,
        body:  document.getElementById('lbody').value,
        color
      };
      if (isEdit) Store.updateLetter(l.id, patch);
      else Store.addLetter(patch);
      scrim.remove();
      openLetter = null;
      render();
    };
    if (isEdit){
      scrim.querySelector('[data-del]').onclick = async () => {
        if (await customDialog('Delete this note? This cannot be undone.', { isConfirm: true, isDanger: true })) {
          Store.removeLetter(l.id);
          scrim.remove();
          openLetter = null;
          render();
        }
      };
    }
  }

  // ---------- GALLERY ----------
  function renderGallery(){
    const d = Store.get();
    const q = gallerySearch.toLowerCase();
    const photos = d.photos.filter(p => !q || (p.caption||'').toLowerCase().includes(q) || (p.date||'').includes(q));
    root.innerHTML = `
      ${topbar()}
      <div class="page">
        ${menu('gallery')}
        <div class="page-header" style="text-align:center">
          <div class="eyebrow">Our Gallery</div>
          <h1 class="page-title">Moments, <em>remembered</em></h1>
          <div class="page-sub">every quiet thing, kept</div>
        </div>
        <div class="gallery-toolbar">
          <div class="search-box">${icon('search')}<input type="text" placeholder="search captions or dates..." id="gsearch" value="${esc(gallerySearch)}"></div>
          <button class="btn" id="addPhotoBtn">${icon('plus')} Add photo</button>
        </div>
        ${photos.length===0 ? `<div class="empty"><span class="leaf">❦</span>${gallerySearch?'no moments match that':'no photos yet — tap "add photo" to begin'}</div>` : `
        <div class="masonry">
          ${photos.map(p => `
            <div class="m-item" data-photo="${esc(p.id)}">
              ${p.url ? `<img src="${esc(p.url)}" alt="${esc(p.caption||'')}" loading="lazy">` : `<div class="m-ph">photo placeholder</div>`}
              <button class="m-del" data-del="${esc(p.id)}" title="Remove">×</button>
              ${(p.caption||p.date) ? `<div class="mcap"><span>${esc(p.caption||'')}</span><span class="mdate">${esc(fmtDate(p.date))}</span></div>`:''}
            </div>
          `).join('')}
        </div>`}
      </div>
    `;
    wireTopbar();
    document.getElementById('addPhotoBtn').onclick = () => openPhotoEditor();
    document.getElementById('gsearch').oninput = (e) => {
      gallerySearch = e.target.value;
      // debounce-free, simple re-render
      renderGallery();
    };
    root.querySelectorAll('[data-photo]').forEach(el => {
      el.onclick = (e) => {
        if (e.target.matches('[data-del]')) return;
        const p = Store.get().photos.find(x => x.id === el.dataset.photo);
        if (p) showLightbox(p);
      };
    });
    root.querySelectorAll('[data-del]').forEach(b => {
      b.onclick = async (e) => {
        e.stopPropagation();
        if (await customDialog('Remove this photo?', { isConfirm: true, isDanger: true })) {
          Store.removePhoto(b.dataset.del);
          renderGallery();
        }
      };
    });
  }

  function openPhotoEditor(photo){
    const isEdit = !!photo;
    const p = photo || { url:'', caption:'', date: new Date().toISOString().slice(0,10) };
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.innerHTML = `
      <div class="dialog">
        <h2>${isEdit?'Edit photo':'Add a memory'}</h2>
        <div class="dsub">paste an image URL, or upload from your device</div>
        <div class="field"><label>Image URL</label><input id="purl" value="${esc(p.url)}" placeholder="https://... or leave blank & upload below"></div>
        <div class="field"><label>Or upload</label>
          <input type="file" id="pfile" accept="image/*" multiple>
          <div class="hint">select multiple photos to upload at once.</div>
        </div>
        <div class="field"><label>Caption</label><input id="pcap" value="${esc(p.caption)}" placeholder="a golden afternoon"></div>
        <div class="field"><label>Date</label><input type="date" id="pdate" value="${esc(p.date)}"></div>
        <div class="dialog-actions">
          <button class="btn ghost" data-cancel>Cancel</button>
          <button class="btn" data-save>Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    scrim.querySelector('[data-cancel]').onclick = () => scrim.remove();
    scrim.querySelector('[data-save]').onclick = async () => {
      const url = document.getElementById('purl').value.trim();
      const files = document.getElementById('pfile').files;
      const caption = document.getElementById('pcap').value.trim();
      const date = document.getElementById('pdate').value;

      if (!url && files.length === 0) { alert('please add a URL or select files'); return; }

      const saveBtn = scrim.querySelector('[data-save]');
      saveBtn.textContent = 'Saving...';
      saveBtn.disabled = true;

      try {
        if (isEdit) {
          let editUrl = url;
          if (files.length > 0) editUrl = await fileToDataURL(files[0]);
          Store.updatePhoto(p.id, { url: editUrl, caption, date });
        } else {
          if (url) {
            Store.addPhoto({ url, caption, date });
          }
          for (let i = 0; i < files.length; i++) {
            const dataUrl = await fileToDataURL(files[i]);
            Store.addPhoto({ url: dataUrl, caption, date });
          }
        }
        scrim.remove();
        render();
      } catch (err) {
        alert(err.message || 'Failed to process image');
        saveBtn.textContent = 'Save';
        saveBtn.disabled = false;
      }
    };
  }

  function fileToDataURL(file){
    return new Promise((res,rej) => {
      // Resize large images
      const MAX_DIM = 1600;
      const MAX_SIZE = 800 * 1024; // 800KB target
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let {width, height} = img;
        if (width > MAX_DIM || height > MAX_DIM){
          const ratio = Math.min(MAX_DIM/width, MAX_DIM/height);
          width = Math.round(width*ratio); height = Math.round(height*ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        // Iteratively shrink until under target
        while (dataUrl.length > MAX_SIZE && quality > 0.2){
          quality -= 0.15;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        res(dataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        // If file is very large and couldn't be decoded to canvas, reject it to protect Firestore
        if (file.size > 1024 * 1024) {
          rej(new Error("Image format not supported for compression and file is too large. Please use a smaller JPEG/PNG or paste a URL."));
          return;
        }
        // Fallback to raw read
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = () => rej(r.error);
        r.readAsDataURL(file);
      };
      img.src = url;
    });
  }

  function showLightbox(p){
    const el = document.createElement('div');
    el.className = 'lightbox';
    el.innerHTML = `
      <button class="lclose">×</button>
      <img src="${esc(p.url)}">
      ${(p.caption||p.date)?`<div class="lcap">${esc(p.caption||'')}${p.caption&&p.date?' · ':''}${esc(fmtDate(p.date))}</div>`:''}
    `;
    document.body.appendChild(el);
    el.addEventListener('click', e => { if(e.target===el || e.target.classList.contains('lclose')) el.remove(); });
  }

  // ---------- MAP ----------
  async function renderMap(){
    const d = Store.get();
    root.innerHTML = `
      ${topbar()}
      <div class="page">
        ${menu('map')}
        <div class="page-header" style="text-align:center">
          <div class="eyebrow">Our Map</div>
          <h1 class="page-title">Places, <em>together</em></h1>
          <div class="page-sub">every pin, a story</div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-bottom:16px">
          <button class="btn" id="addPlaceBtn">${icon('plus')} Add a place</button>
        </div>
        <div class="map-layout">
          <div id="map"></div>
          <div class="places-list">
            ${d.places.length===0 ? `<div class="empty" style="padding:40px 20px"><span class="leaf">❦</span>no places yet</div>` :
              d.places.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(p => `
                <div class="place-item" data-place="${esc(p.id)}">
                  <h4>${esc(p.name)}</h4>
                  <div class="pd">${esc(fmtDate(p.date))}</div>
                  ${p.note?`<div class="pn">${esc(p.note)}</div>`:''}
                  <div class="pcount">${(p.photos||[]).length} photo${(p.photos||[]).length===1?'':'s'} →</div>
                </div>
              `).join('')
            }
          </div>
        </div>
      </div>
    `;
    wireTopbar();
    document.getElementById('addPlaceBtn').onclick = () => openPlaceEditor();

    await loadWorldMap();
    const chartDom = document.getElementById('map');
    if (!chartDom) return;
    
    // Ensure container has size before init (important for ECharts)
    const myChart = echarts.init(chartDom);
    
    const sortedPlaces = [...d.places].sort((a,b)=>new Date(a.date)-new Date(b.date)).filter(p => typeof p.lng === 'number' && typeof p.lat === 'number' && !isNaN(p.lng) && !isNaN(p.lat));
    const scatterData = sortedPlaces.map(p => ({
      name: p.name,
      value: [p.lng, p.lat, p.id],
      photos: p.photos || [],
      date: p.date
    }));

    // Hub-and-spoke lines: Oslo as the center, connecting to all other places
    const osloCoord = [10.75, 59.91]; // Oslo, Norway
    const linesData = sortedPlaces
      .filter(p => Math.sqrt(Math.pow(p.lng - osloCoord[0], 2) + Math.pow(p.lat - osloCoord[1], 2)) > 0.5)
      .map(p => ({
        coords: [osloCoord, [p.lng, p.lat]]
      }));

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: function(p, ticket, callback) {
          if (p.seriesType !== 'scatter') return '';
          const pName = p.name;
          const pDate = p.data.date;
          
          const getHtml = (imgSrc) => `
            <div style="text-align:center; width: 160px;">
              <img src="${imgSrc}" style="width: 160px; height: 160px; object-fit: cover; display: block; margin-bottom: 12px; background: #eee;">
              <div style="font-family:serif; font-weight: 600; font-size: 16px; color:#2a3625; line-height: 1.2;">${pName}</div>
              <div style="font-size: 11px; color:#7a8a60; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">${fmtDate(pDate)}</div>
            </div>
          `;

          window._wikiImageCache = window._wikiImageCache || {};
          if (window._wikiImageCache[pName]) {
             return getHtml(window._wikiImageCache[pName]);
          }

          const fallback = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="%23f2f4ec"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">📍</text></svg>';

          // Fetch iconic image from Wikipedia API async
          fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pName)}&prop=pageimages&format=json&pithumbsize=400&origin=*`)
            .then(res => res.json())
            .then(data => {
               let src = fallback;
               if (data && data.query && data.query.pages) {
                 const pageId = Object.keys(data.query.pages)[0];
                 if (pageId !== "-1" && data.query.pages[pageId].thumbnail) {
                   src = data.query.pages[pageId].thumbnail.source;
                 }
               }
               window._wikiImageCache[pName] = src;
               callback(ticket, getHtml(src));
            })
            .catch(() => {
               window._wikiImageCache[pName] = fallback;
               callback(ticket, getHtml(fallback));
            });
            
          return getHtml(fallback); // Show fallback while loading
        },
        backgroundColor: '#ffffff',
        borderColor: '#e1e3d6',
        borderWidth: 1,
        padding: [8, 8, 16, 8],
        extraCssText: 'box-shadow: 0 12px 30px rgba(30, 40, 20, 0.2); border-radius: 4px;'
      },
      geo: {
        map: 'world',
        roam: true,
        itemStyle: {
          areaColor: '#2b3626',
          borderColor: '#4a5838',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: { areaColor: '#3a4a35' },
          label: { show: false }
        }
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: scatterData,
          symbol: 'pin',
          symbolSize: 18,
          symbolOffset: [0, '-50%'],
          itemStyle: { color: '#e6b99a', shadowBlur: 10, shadowColor: '#e6b99a' }
        },
        {
          type: 'lines',
          coordinateSystem: 'geo',
          data: linesData,
          lineStyle: { color: '#ffffffff', width: 1, opacity: 0.4, curveness: 0.3, type: 'dashed' }
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [{ name: 'Home 🏠', value: [10.75, 59.91] }],
          symbol: 'pin',
          symbolSize: 26,
          symbolOffset: [0, '-50%'],
          itemStyle: { color: '#e05a5a', shadowBlur: 14, shadowColor: 'rgba(224,90,90,0.5)' },
          label: { show: true, formatter: '🏠', fontSize: 10, offset: [0, -2] },
          silent: true,
          z: 5
        }
      ]
    };

    myChart.setOption(option);
    myChart.on('click', params => {
      if(params.componentType === 'series' && params.seriesType === 'scatter') {
        const p = Store.get().places.find(x => x.id === params.data.value[2]);
        if (p) { openPlaceId = p.id; render(); }
      }
    });

    root.querySelectorAll('.place-item').forEach(el => {
      el.onclick = () => { openPlaceId = el.dataset.place; render(); };
      el.onmouseenter = () => {
        el.classList.add('active');
        const p = Store.get().places.find(x => x.id === el.dataset.place);
        if (p && typeof p.lng === 'number') {
          myChart.dispatchAction({ type: 'showTip', seriesIndex: 0, name: p.name });
          myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, name: p.name });
        }
      };
      el.onmouseleave = () => {
        el.classList.remove('active');
        myChart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
      };
    });

    window.addEventListener('resize', () => { if(myChart) myChart.resize(); });

    if (openPlaceId) showPlaceDialog();
  }

  function showPlaceDialog(){
    const p = Store.get().places.find(x => x.id === openPlaceId);
    if (!p){ openPlaceId = null; return; }
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.innerHTML = `
      <div class="dialog" style="max-width:620px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
          <div>
            <h2>${esc(p.name)}</h2>
            <div class="dsub">${esc(fmtDateLong(p.date))}</div>
          </div>
          <button class="icon-btn" data-close style="background:transparent">×</button>
        </div>
        ${p.note?`<div style="font-family:var(--serif);font-size:18px;color:var(--ink-soft);font-style:italic;margin-bottom:8px;line-height:1.5">${esc(p.note)}</div>`:''}
        <div class="divider"></div>
        <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:600">Photos from here</div>
        <div class="place-photos">
          ${(p.photos||[]).map((src,i)=>`<div class="pp" data-ppi="${i}"><img src="${esc(src)}"><button class="m-del" data-ppdel="${i}" style="display:flex">×</button></div>`).join('')}
          <div class="pp-add" id="addPP">+</div>
        </div>
        <div class="dialog-actions" style="margin-top:22px">
          <button class="btn ghost" data-edit style="margin-right:auto">Edit place</button>
          <button class="btn soft" data-close>Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    scrim.addEventListener('click', e => { if(e.target===scrim){ openPlaceId=null; scrim.remove(); }});
    scrim.querySelectorAll('[data-close]').forEach(b => b.onclick = () => { openPlaceId=null; scrim.remove(); });
    scrim.querySelector('[data-edit]').onclick = () => { scrim.remove(); openPlaceEditor(p); };
    scrim.querySelector('#addPP').onclick = () => addPhotoToPlace(p.id);
    scrim.querySelectorAll('[data-ppi]').forEach(el => {
      el.onclick = (e) => {
        if (e.target.matches('[data-ppdel]')) return;
        showLightbox({ url: p.photos[+el.dataset.ppi], caption: p.name, date:p.date });
      };
    });
    scrim.querySelectorAll('[data-ppdel]').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        const i = +b.dataset.ppdel;
        const next = [...p.photos];
        next.splice(i,1);
        Store.updatePlace(p.id, { photos: next });
        scrim.remove();
        render();
      };
    });
  }

  function addPhotoToPlace(placeId){
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.innerHTML = `
      <div class="dialog">
        <h2>Add a photo</h2>
        <div class="dsub">from this place</div>
        <div class="field"><label>Image URL</label><input id="purl" placeholder="https://..."></div>
        <div class="field"><label>Or upload</label><input type="file" id="pfile" accept="image/*" multiple></div>
        <div class="dialog-actions">
          <button class="btn ghost" data-cancel>Cancel</button>
          <button class="btn" data-save>Add</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    scrim.querySelector('[data-cancel]').onclick = () => scrim.remove();
    scrim.querySelector('[data-save]').onclick = async () => {
      const url = document.getElementById('purl').value.trim();
      const files = document.getElementById('pfile').files;
      if (!url && files.length === 0){ alert('add a URL or select files first'); return; }
      
      const saveBtn = scrim.querySelector('[data-save]');
      saveBtn.textContent = 'Adding...';
      saveBtn.disabled = true;

      try {
        const place = Store.get().places.find(x => x.id === placeId);
        const newUrls = [];
        if (url) newUrls.push(url);
        for (let i = 0; i < files.length; i++) {
          newUrls.push(await fileToDataURL(files[i]));
        }
        Store.updatePlace(placeId, { photos:[...(place.photos||[]), ...newUrls] });
        scrim.remove();
        render();
      } catch (err) {
        alert(err.message || 'Failed to process image');
        saveBtn.textContent = 'Add';
        saveBtn.disabled = false;
      }
    };
  }

  function openPlaceEditor(place){
    const isEdit = !!place;
    const p = place || { name:'', note:'', lat:'', lng:'', date:new Date().toISOString().slice(0,10), photos:[] };
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.innerHTML = `
      <div class="dialog">
        <h2>${isEdit?'Edit place':'A new place'}</h2>
        <div class="dsub">where were we?</div>
        <div class="field"><label>Name</label><input id="nname" value="${esc(p.name)}" placeholder="e.g. Kyoto, the little cafe in Kyoto..."></div>
        <div class="field"><label>Date we were there</label><input type="date" id="ndate" value="${esc(p.date)}"></div>
        <div class="field"><label>A little note</label><textarea id="nnote" placeholder="what was special about it">${esc(p.note)}</textarea></div>
        <div style="display:none">
          <input id="nlat" value="${esc(p.lat)}">
          <input id="nlng" value="${esc(p.lng)}">
        </div>
        <div class="field" style="margin-top:12px">
          <label>Location</label>
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <input id="locSearch" placeholder="Search a city, cafe, or place..." style="flex:1">
            <button class="btn soft" id="locSearchBtn" style="padding:0 16px">Search</button>
          </div>
          <div id="miniMap" style="height:220px;border-radius:8px;border:1px solid #d9dcd0;overflow:hidden;"></div>
          <div class="hint" style="margin-top:6px">Tip: You can search or just click anywhere on the map to drop a pin.</div>
        </div>
        <div class="dialog-actions" style="margin-top:18px">
          ${isEdit?'<button class="btn soft" data-del style="margin-right:auto;color:#a86060">Delete</button>':''}
          <button class="btn ghost" data-cancel>Cancel</button>
          <button class="btn" data-save>Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    
    // Initialize minimap
    let miniChart;
    setTimeout(async () => {
      await loadWorldMap();
      const miniMapDom = document.getElementById('miniMap');
      if (!miniMapDom) return;
      miniChart = echarts.init(miniMapDom);

      const lat = parseFloat(document.getElementById('nlat').value) || 20;
      const lng = parseFloat(document.getElementById('nlng').value) || 0;
      const initialZoom = p.lat ? 5 : 1.2;

      const updateMiniMap = (mlat, mlng, mzoom) => {
        miniChart.setOption({
          backgroundColor: '#1a2118',
          geo: {
            map: 'world',
            roam: true,
            center: [mlng, mlat],
            zoom: mzoom || initialZoom,
            itemStyle: { areaColor: '#283324', borderColor: '#3b4b35', borderWidth: 1 },
            emphasis: { itemStyle: { areaColor: '#3a4a35' } }
          },
          series: [{
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [[mlng, mlat]],
            symbol: 'pin',
            symbolSize: 18,
            symbolOffset: [0, '-50%'],
            itemStyle: { color: '#e6b99a' }
          }]
        });
      };

      updateMiniMap(lat, lng, initialZoom);

      miniChart.getZr().on('click', function(e) {
        const coord = miniChart.convertFromPixel('geo', [e.offsetX, e.offsetY]);
        if(coord) {
          document.getElementById('nlng').value = coord[0].toFixed(6);
          document.getElementById('nlat').value = coord[1].toFixed(6);
          // Keep current zoom and center
          const opt = miniChart.getOption();
          const currZoom = opt.geo[0].zoom;
          updateMiniMap(coord[1], coord[0], currZoom);
        }
      });
    }, 50);

    const searchBtn = scrim.querySelector('#locSearchBtn');
    const searchInput = scrim.querySelector('#locSearch');
    const doSearch = async (e) => {
      if (e) e.preventDefault();
      const q = searchInput.value.trim();
      if (!q) return;
      searchBtn.textContent = '...';
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          document.getElementById('nlat').value = lat.toFixed(6);
          document.getElementById('nlng').value = lng.toFixed(6);
          if (miniChart) {
            miniChart.setOption({
              geo: { center: [lng, lat], zoom: 5 },
              series: [{ data: [[lng, lat]] }]
            });
          }
        } else {
          alert('Place not found. Try a different search term or click on the map.');
        }
      } catch (err) {
        alert('Search failed');
      }
      searchBtn.textContent = 'Search';
    };
    searchBtn.onclick = doSearch;
    searchInput.onkeydown = (e) => { if(e.key === 'Enter') { e.preventDefault(); doSearch(); } };

    scrim.querySelector('[data-cancel]').onclick = () => scrim.remove();
    scrim.querySelector('[data-save]').onclick = async () => {
      const patch = {
        name: document.getElementById('nname').value.trim(),
        note: document.getElementById('nnote').value.trim(),
        date: document.getElementById('ndate').value,
        lat: parseFloat(document.getElementById('nlat').value),
        lng: parseFloat(document.getElementById('nlng').value)
      };
      if (!patch.name){ alert('give it a name'); return; }
      if (Number.isNaN(patch.lat) || Number.isNaN(patch.lng)){
        if (!(await customDialog('Latitude/Longitude missing — it won\'t show on the map. Save anyway?', { isConfirm: true }))) return;
        if (Number.isNaN(patch.lat)) patch.lat = null;
        if (Number.isNaN(patch.lng)) patch.lng = null;
      }
      if (isEdit) Store.updatePlace(p.id, patch);
      else Store.addPlace(patch);
      scrim.remove();
      openPlaceId = null;
      render();
    };
    if (isEdit){
      scrim.querySelector('[data-del]').onclick = async () => {
        if (await customDialog('Delete this place and all its photos?', { isConfirm: true, isDanger: true })){
          Store.removePlace(p.id);
          scrim.remove();
          openPlaceId = null;
          render();
        }
      };
    }
  }

  // ---------- Admin drawer ----------
  function renderAdminDrawer(){
    // Clean up any existing drawer + scrim first
    document.querySelectorAll('.drawer-scrim, .drawer').forEach(el => el.remove());
    if (!adminOpen) return;
    const d = Store.get();
    const scrim = document.createElement('div');
    scrim.className = 'drawer-scrim';
    scrim.style.cssText = 'position:fixed;inset:0;background:rgba(40,46,30,.35);backdrop-filter:blur(4px);z-index:89';
    document.body.appendChild(scrim);

    const drawer = document.createElement('div');
    drawer.className = 'drawer open';
    drawer.innerHTML = `
      <button class="closeX" data-close>×</button>
      <h2>Garden settings</h2>
      <div class="ds">tend to the details of our little place</div>

      <div class="drawer-section">
        <h3>About us</h3>
        <div class="field"><label>Your name</label><input id="aname1" value="${esc(d.couple.name1)}"></div>
        <div class="field"><label>Their name</label><input id="aname2" value="${esc(d.couple.name2)}"></div>
        <div class="field"><label>Motto / subtitle</label><input id="amotto" value="${esc(d.couple.motto)}"></div>
        <div class="field"><label>Anniversary (this is also your password)</label><input type="date" id="aanniv" value="${esc(d.couple.anniversary)}"></div>
        <button class="btn" id="saveCouple">Save</button>
      </div>

      <div class="drawer-section" style="background:${Store.cloud.connected?'#eaf0e0':'#faf6ed'}">
        <h3>☁ Cloud Sync (Firebase) ${Store.cloud.connected?'<span style="font-size:12px;color:var(--sage);font-style:italic;font-weight:400">· connected</span>':''}</h3>
        <p style="font-family:var(--serif);font-style:italic;color:var(--ink-soft);font-size:14px;margin-bottom:12px;line-height:1.5">
          ${Store.cloud.connected
            ? 'data syncs automatically across all devices. both of you see updates in realtime.'
            : 'free · syncs data between you & your partner automatically. see setup guide in FIREBASE_SETUP.md'}
        </p>
        ${Store.cloud.connected ? `
          <div class="drawer-actions">
            <button class="btn soft" id="pushCloudBtn">${icon('upload')} Push local to cloud</button>
            <button class="btn soft" id="disconnectCloudBtn" style="color:#a86060">Disconnect</button>
          </div>
        ` : `
          <button class="btn" id="connectCloudBtn">Connect to Firebase</button>
        `}
      </div>

      <div class="drawer-section">
        <h3>Back up &amp; restore</h3>
        <p style="font-family:var(--serif);font-style:italic;color:var(--ink-soft);font-size:14px;margin-bottom:12px;line-height:1.5">export a JSON file as manual backup. keep it in Google Drive or email.</p>
        <div class="drawer-actions">
          <button class="btn soft" id="exportBtn">${icon('download')} Export backup</button>
          <label class="btn soft" style="cursor:pointer">${icon('upload')} Import<input type="file" id="importBtn" accept="application/json" style="display:none"></label>
        </div>
      </div>

      <div class="drawer-section">
        <h3>Quick add</h3>
        <div class="drawer-actions">
          <button class="btn soft" data-quick="letter">${icon('letter')} Write note</button>
          <button class="btn soft" data-quick="photo">${icon('photo')} Add photo</button>
          <button class="btn soft" data-quick="place">${icon('map')} Add place</button>
        </div>
      </div>

      <div class="drawer-section" style="background:#f6ecea;border-color:#e4cfcb">
        <h3 style="color:#a86060">Danger</h3>
        <p style="font-family:var(--serif);font-style:italic;color:var(--ink-soft);font-size:13px;margin-bottom:10px">clears all photos, letters & places in this browser. export first!</p>
        <button class="btn soft" id="resetBtn" style="color:#a86060;border-color:#d9b4ae">Reset everything</button>
      </div>
    `;
    document.body.appendChild(drawer);
    scrim.onclick = () => { adminOpen = false; renderAdminDrawer(); };
    drawer.querySelector('[data-close]').onclick = () => { adminOpen = false; renderAdminDrawer(); };

    drawer.querySelector('#saveCouple').onclick = () => {
      Store.setCouple({
        name1: document.getElementById('aname1').value.trim(),
        name2: document.getElementById('aname2').value.trim(),
        motto: document.getElementById('amotto').value.trim() || 'our little garden',
        anniversary: document.getElementById('aanniv').value
      });
      adminOpen = false;
      renderAdminDrawer();
      render();
    };

    drawer.querySelector('#exportBtn').onclick = () => Store.exportJSON();
    const connectBtn = drawer.querySelector('#connectCloudBtn');
    if (connectBtn) connectBtn.onclick = () => openFirebaseConnect();
    const pushBtn = drawer.querySelector('#pushCloudBtn');
    if (pushBtn) pushBtn.onclick = () => Store.pushLocalToCloud();
    const disBtn = drawer.querySelector('#disconnectCloudBtn');
    if (disBtn) disBtn.onclick = async () => {
      if (await customDialog('Disconnect cloud sync? Local data stays.', { isConfirm: true })) {
        await Store.disconnectCloud();
        adminOpen = false; renderAdminDrawer();
        setTimeout(() => { adminOpen = true; renderAdminDrawer(); }, 50);
      }
    };
    drawer.querySelector('#importBtn').onchange = async (e) => {
      const f = e.target.files[0]; if(!f) return;
      try { await Store.importJSON(f); alert('imported ♡'); adminOpen = false; renderAdminDrawer(); render(); }
      catch(err){ alert('import failed: '+err.message); }
    };
    drawer.querySelector('#resetBtn').onclick = async () => {
      if (await customDialog('Really clear everything? This cannot be undone.', { isConfirm: true, isDanger: true })) {
        Store.resetAll();
        adminOpen = false;
        renderAdminDrawer();
        location.hash = '#/home';
        render();
      }
    };
    drawer.querySelectorAll('[data-quick]').forEach(b => {
      b.onclick = () => {
        adminOpen = false; renderAdminDrawer();
        if (b.dataset.quick==='letter') openLetterEditor();
        if (b.dataset.quick==='photo') openPhotoEditor();
        if (b.dataset.quick==='place') openPlaceEditor();
      };
    });
  }

  function openFirebaseConnect(){
    const existing = Store.cloud.config || {};
    const scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.innerHTML = `
      <div class="dialog" style="max-width:560px">
        <h2>Connect to Firebase</h2>
        <div class="dsub">paste your firebaseConfig from the Firebase console</div>
        <div class="field">
          <label>firebaseConfig (paste the whole object)</label>
          <textarea id="fbcfg" style="font-family:monospace;font-size:13px;min-height:180px" placeholder='{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  ...
}'>${existing.apiKey?JSON.stringify(existing,null,2):''}</textarea>
          <div class="hint">need help? open FIREBASE_SETUP.md for 5-minute setup guide</div>
        </div>
        <div class="dialog-actions">
          <button class="btn ghost" data-cancel>Cancel</button>
          <button class="btn" data-connect>Connect</button>
        </div>
      </div>
    `;
    document.body.appendChild(scrim);
    scrim.querySelector('[data-cancel]').onclick = () => scrim.remove();
    scrim.querySelector('[data-connect]').onclick = async () => {
      const raw = document.getElementById('fbcfg').value.trim();
      let cfg;
      try {
        // Accept both JSON and JS object literal
        cfg = JSON.parse(raw);
      } catch {
        try {
          // try eval-ish parse (remove "const firebaseConfig =" prefix if any)
          const cleaned = raw.replace(/^\s*(const|let|var)\s+\w+\s*=\s*/,'').replace(/;?\s*$/,'');
          cfg = Function('"use strict";return('+cleaned+')')();
        } catch(e){ alert('invalid config format'); return; }
      }
      if (!cfg.apiKey || !cfg.projectId){ alert('missing apiKey or projectId'); return; }
      const ok = await Store.connectCloud(cfg);
      if (ok){
        scrim.remove();
        adminOpen = false; renderAdminDrawer();
        setTimeout(() => { adminOpen = true; renderAdminDrawer(); }, 50);
        alert('Connected to cloud ♡ data now syncs automatically');
      }
    };
  }

  function wireTopbar(){
    const ab = document.getElementById('adminBtn');
    if (ab) ab.onclick = () => { adminOpen = !adminOpen; renderAdminDrawer(); };
    const lb = document.getElementById('lockBtn');
    if (lb) lb.onclick = () => { Store.lock(); render(); };
  }

  // ---------- Main render ----------
  function hideSkeleton() {
    const sl = document.getElementById('skeletonLoader');
    if (sl && !sl.classList.contains('hidden')) {
      setTimeout(() => sl.classList.add('hidden'), 500);
      setTimeout(() => sl.remove(), 1000);
    }
  }

  function render(){
    const d = Store.get();
    if (!d.session.unlocked){ renderLogin(); hideSkeleton(); return; }
    const r = currentRoute();
    switch(r.path){
      case 'home': renderHome(); break;
      case 'letters': renderLetters(); break;
      case 'gallery': renderGallery(); break;
      case 'map': renderMap(); break;
      default: location.hash = '#/home'; renderHome();
    }
    hideSkeleton();
  }

  // Initial route
  if (!location.hash) location.hash = '#/home';
  Store.init().then(() => render());

  // Global resize handler for responsive map layout on iPad/Mobile
  window.addEventListener('resize', () => {
    try {
      const mapDom = document.getElementById('map');
      if (mapDom && window.echarts) {
        const chart = echarts.getInstanceByDom(mapDom);
        if (chart) chart.resize();
      }
      const miniMapDom = document.getElementById('miniMap');
      if (miniMapDom && window.echarts) {
        const miniChart = echarts.getInstanceByDom(miniMapDom);
        if (miniChart) miniChart.resize();
      }
    } catch(e) {}
  });
})();
