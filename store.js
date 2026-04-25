// Sage Garden · data store
// Supports: local (localStorage) + cloud (Firebase Firestore) modes
// Anyone with physical access to this browser can read local data. Export JSON to back up.

(function () {
  const KEY = "sageGarden.v1";
  const FB_KEY = "sageGarden.firebase";
  const DEFAULT = {
    couple: {
      anniversary: "2025-06-10",
      name1: "",
      name2: "",
      motto: "our little garden",
    },
    photos: [],
    letters: [],
    places: [],
    songs: [],
    session: { unlocked: false },
  };

  // ----- Firebase adapter -----
  // นำ Firebase Config ที่ได้มาแปะในนี้ได้เลยครับ ระบบจะเชื่อมต่อให้อัตโนมัติ (ไม่ต้องไปกรอกในหน้าเว็บแล้ว)
  const HARDCODED_CONFIG = {
    apiKey: "AIzaSyCNlmHdR1RNZgpeFaP7Eekrndbb9qgAfPY",
    authDomain: "our-garden-b8193.firebaseapp.com",
    databaseURL:
      "https://our-garden-b8193-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "our-garden-b8193",
    storageBucket: "our-garden-b8193.firebasestorage.app",
    messagingSenderId: "965361592837",
    appId: "1:965361592837:web:b568ae835e304869094a6c",
  };

  let fb = { app: null, db: null, connected: false, config: null, unsubs: [] };

  function loadFBConfig() {
    if (HARDCODED_CONFIG && HARDCODED_CONFIG.apiKey) return HARDCODED_CONFIG;
    try {
      return JSON.parse(localStorage.getItem(FB_KEY) || "null");
    } catch {
      return null;
    }
  }
  function saveFBConfig(cfg) {
    if (HARDCODED_CONFIG && HARDCODED_CONFIG.apiKey) return; // ไม่เซฟลง localStorage ถ้า hardcode ไว้
    if (cfg) localStorage.setItem(FB_KEY, JSON.stringify(cfg));
    else localStorage.removeItem(FB_KEY);
  }

  async function loadFirebaseSDK() {
    if (window._fbLoaded) return;
    const [
      { initializeApp, getApps, getApp, deleteApp },
      { getFirestore, doc, setDoc, onSnapshot, getDoc, collection, deleteDoc },
    ] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
    ]);
    window._fbLoaded = {
      initializeApp,
      getApps,
      getApp,
      deleteApp,
      getFirestore,
      doc,
      setDoc,
      onSnapshot,
      getDoc,
      collection,
      deleteDoc,
    };
  }

  async function connectFirebase(config) {
    await loadFirebaseSDK();
    const {
      initializeApp,
      getApps,
      deleteApp,
      getFirestore,
      doc,
      onSnapshot,
      getDoc,
      collection,
      setDoc,
    } = window._fbLoaded;

    // Clean up any existing app instance first
    if (fb.unsubs) {
      fb.unsubs.forEach((u) => {
        try {
          u();
        } catch (e) {}
      });
      fb.unsubs = [];
    }
    const existing = getApps();
    for (const a of existing) {
      try {
        await deleteApp(a);
      } catch {}
    }

    const app = initializeApp(config);
    const db = getFirestore(app);
    fb.app = app;
    fb.db = db;
    fb.config = config;
    fb.connected = true;
    saveFBConfig(config);

    const ref = doc(db, "gardens", "ours");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      // Auto-Migration: If old data exists in the main document, move them to subcollections!
      if (
        !data._migrated &&
        (data.photos?.length || data.places?.length || data.letters?.length)
      ) {
        console.log("Migrating data to subcollections to bypass 1MB limit...");
        if (data.photos)
          for (let p of data.photos)
            await setDoc(doc(db, "gardens/ours/photos", p.id), p);
        if (data.places)
          for (let p of data.places)
            await setDoc(doc(db, "gardens/ours/places", p.id), p);
        if (data.letters)
          for (let p of data.letters)
            await setDoc(doc(db, "gardens/ours/letters", p.id), p);
        await setDoc(ref, {
          couple: data.couple || DEFAULT.couple,
          _migrated: true,
        });
      } else {
        Store._data.couple = { ...DEFAULT.couple, ...(data.couple || {}) };
      }
    } else {
      await setDoc(ref, { couple: DEFAULT.couple, _migrated: true });
    }

    if (fb.unsubs) {
      fb.unsubs.forEach((u) => {
        try {
          u();
        } catch (e) {}
      });
      fb.unsubs = [];
    }

    // Listen to metadata
    fb.unsubs.push(
      onSnapshot(ref, (snap) => {
        if (!snap.exists()) return;
        Store._data.couple = {
          ...DEFAULT.couple,
          ...(snap.data().couple || {}),
        };
        saveLocal(Store._data);
        listeners.forEach((fn) => fn(Store._data));
      }),
    );

    // Listen to photos
    fb.unsubs.push(
      onSnapshot(collection(db, "gardens/ours/photos"), (snap) => {
        const arr = [];
        snap.forEach((d) => arr.push(d.data()));
        Store._data.photos = arr.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        saveLocal(Store._data);
        listeners.forEach((fn) => fn(Store._data));
      }),
    );

    // Listen to places
    fb.unsubs.push(
      onSnapshot(collection(db, "gardens/ours/places"), (snap) => {
        const arr = [];
        snap.forEach((d) => arr.push(d.data()));
        Store._data.places = arr;
        saveLocal(Store._data);
        listeners.forEach((fn) => fn(Store._data));
      }),
    );

    // Listen to letters
    fb.unsubs.push(
      onSnapshot(collection(db, "gardens/ours/letters"), (snap) => {
        const arr = [];
        snap.forEach((d) => arr.push(d.data()));
        Store._data.letters = arr.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        saveLocal(Store._data);
        listeners.forEach((fn) => fn(Store._data));
      }),
    );

    // Listen to songs
    fb.unsubs.push(
      onSnapshot(collection(db, "gardens/ours/songs"), (snap) => {
        const arr = [];
        snap.forEach((d) => arr.push(d.data()));
        Store._data.songs = arr;
        saveLocal(Store._data);
        listeners.forEach((fn) => fn(Store._data));
      }),
    );
  }

  async function disconnectFirebase() {
    if (fb.unsubs) {
      fb.unsubs.forEach((u) => {
        try {
          u();
        } catch (e) {}
      });
      fb.unsubs = [];
    }
    fb = { app: null, db: null, connected: false, config: null, unsubs: [] };
    saveFBConfig(null);
  }

  // pushToFirebase is removed as sync is now handled per-entity.

  fb.clientId = Math.random().toString(36).slice(2);

  // ----- Local storage (IndexedDB) -----
  const DB_NAME = "sageGardenDB";
  const STORE_NAME = "state";

  function initDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        e.target.result.createObjectStore(STORE_NAME);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function loadLocal() {
    try {
      const db = await initDB();
      return new Promise((res) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const req = tx.objectStore(STORE_NAME).get(KEY);
        req.onsuccess = () => {
          if (req.result) {
            const data = JSON.parse(req.result);
            res({
              couple: { ...DEFAULT.couple, ...(data.couple || {}) },
              photos: data.photos || [],
              letters: data.letters || [],
              places: data.places || [],
              songs: data.songs || [],
              session: data.session || { unlocked: false },
            });
          } else {
            // Migration from old localStorage
            const oldRaw = localStorage.getItem(KEY);
            if (oldRaw) {
              const parsed = JSON.parse(oldRaw);
              saveLocal(parsed); // migrate to IDB
              res(parsed);
            } else {
              res(structuredClone(DEFAULT));
            }
          }
        };
        req.onerror = () => res(structuredClone(DEFAULT));
      });
    } catch {
      return structuredClone(DEFAULT);
    }
  }

  async function saveLocal(data) {
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(JSON.stringify(data), KEY);
    } catch (e) {
      console.error("IDB save failed", e);
    }
  }

  const listeners = new Set();

  const Store = {
    _data: structuredClone(DEFAULT),
    async init() {
      this._data = await loadLocal();
      listeners.forEach((fn) => fn(this._data));
    },
    get() {
      return this._data;
    },
    set(mutator) {
      if (typeof mutator === "function") mutator(this._data);
      else this._data = mutator;
      saveLocal(this._data);
      listeners.forEach((fn) => fn(this._data));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    uid() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    },

    async addPhoto(p) {
      const obj = {
        id: this.uid(),
        date: new Date().toISOString().slice(0, 10),
        ...p,
      };
      this.set((d) => {
        d.photos.unshift(obj);
      });
      if (fb.connected)
        await window._fbLoaded.setDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/photos", obj.id),
          obj,
        );
    },
    async updatePhoto(id, patch) {
      let obj;
      this.set((d) => {
        const i = d.photos.findIndex((x) => x.id === id);
        if (i > -1) {
          Object.assign(d.photos[i], patch);
          obj = d.photos[i];
        }
      });
      if (fb.connected && obj)
        await window._fbLoaded.setDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/photos", id),
          obj,
        );
    },
    async removePhoto(id) {
      this.set((d) => {
        d.photos = d.photos.filter((x) => x.id !== id);
      });
      if (fb.connected)
        await window._fbLoaded.deleteDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/photos", id),
        );
    },

    async addLetter(l) {
      const obj = {
        id: this.uid(),
        date: new Date().toISOString().slice(0, 10),
        color: "peach",
        ...l,
      };
      this.set((d) => {
        d.letters.unshift(obj);
      });
      if (fb.connected)
        await window._fbLoaded.setDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/letters", obj.id),
          obj,
        );
    },
    async updateLetter(id, patch) {
      let obj;
      this.set((d) => {
        const i = d.letters.findIndex((x) => x.id === id);
        if (i > -1) {
          Object.assign(d.letters[i], patch);
          obj = d.letters[i];
        }
      });
      if (fb.connected && obj)
        await window._fbLoaded.setDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/letters", id),
          obj,
        );
    },
    async removeLetter(id) {
      this.set((d) => {
        d.letters = d.letters.filter((x) => x.id !== id);
      });
      if (fb.connected)
        await window._fbLoaded.deleteDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/letters", id),
        );
    },

    async addPlace(p) {
      const obj = {
        id: this.uid(),
        date: new Date().toISOString().slice(0, 10),
        photos: [],
        ...p,
      };
      this.set((d) => {
        d.places.push(obj);
      });
      if (fb.connected)
        await window._fbLoaded.setDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/places", obj.id),
          obj,
        );
    },
    async updatePlace(id, patch) {
      let obj;
      this.set((d) => {
        const i = d.places.findIndex((x) => x.id === id);
        if (i > -1) {
          Object.assign(d.places[i], patch);
          obj = d.places[i];
        }
      });
      if (fb.connected && obj)
        await window._fbLoaded.setDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/places", id),
          obj,
        );
    },
    async removePlace(id) {
      this.set((d) => {
        d.places = d.places.filter((x) => x.id !== id);
      });
      if (fb.connected)
        await window._fbLoaded.deleteDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/places", id),
        );
    },

    async addSong(s) {
      const obj = {
        id: this.uid(),
        date: new Date().toISOString().slice(0, 10),
        ...s,
      };
      this.set((d) => {
        d.songs.unshift(obj);
      });
      if (fb.connected)
        await window._fbLoaded.setDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/songs", obj.id),
          obj,
        );
    },
    async updateSong(id, patch) {
      let obj;
      this.set((d) => {
        const i = d.songs.findIndex((x) => x.id === id);
        if (i > -1) {
          Object.assign(d.songs[i], patch);
          obj = d.songs[i];
        }
      });
      if (fb.connected && obj)
        await window._fbLoaded.setDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/songs", id),
          obj,
        );
    },
    async removeSong(id) {
      this.set((d) => {
        d.songs = d.songs.filter((x) => x.id !== id);
      });
      if (fb.connected)
        await window._fbLoaded.deleteDoc(
          window._fbLoaded.doc(fb.db, "gardens/ours/songs", id),
        );
    },

    async setCouple(patch) {
      this.set((d) => {
        Object.assign(d.couple, patch);
      });
      if (fb.connected)
        await window._fbLoaded.setDoc(
          window._fbLoaded.doc(fb.db, "gardens", "ours"),
          { couple: this._data.couple },
          { merge: true },
        );
    },
    unlock() {
      this._data.session.unlocked = true;
      saveLocal(this._data);
      listeners.forEach((fn) => fn(this._data));
    },
    lock() {
      this._data.session.unlocked = false;
      saveLocal(this._data);
      listeners.forEach((fn) => fn(this._data));
    },

    exportJSON() {
      const data = { ...this._data };
      delete data.session;
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `our-garden-backup-${stamp}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    importJSON(file) {
      return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => {
          try {
            const obj = JSON.parse(r.result);
            this.set((d) => {
              if (obj.couple) Object.assign(d.couple, obj.couple);
              if (Array.isArray(obj.photos)) d.photos = obj.photos;
              if (Array.isArray(obj.letters)) d.letters = obj.letters;
              if (Array.isArray(obj.places)) d.places = obj.places;
            });
            res();
          } catch (e) {
            rej(e);
          }
        };
        r.onerror = () => rej(r.error);
        r.readAsText(file);
      });
    },
    resetAll() {
      this._data = structuredClone(DEFAULT);
      saveLocal(this._data);
      listeners.forEach((fn) => fn(this._data));
      if (fb.connected) pushToFirebase(this._data);
    },

    // ----- Cloud -----
    get cloud() {
      return { connected: fb.connected, config: fb.config };
    },
    async connectCloud(config) {
      try {
        await connectFirebase(config);
        // Immediately push current data if remote was empty
        if (fb.connected) {
          const { doc, getDoc } = window._fbLoaded;
          const snap = await getDoc(doc(fb.db, "gardens", "ours"));
          if (!snap.exists()) await pushToFirebase(this._data);
        }
        return true;
      } catch (e) {
        alert("Failed to connect: " + (e.message || e));
        return false;
      }
    },
    async disconnectCloud() {
      await disconnectFirebase();
    },
    async pushLocalToCloud() {
      if (!fb.connected) {
        alert("Connect to Firebase first");
        return;
      }
      await pushToFirebase(this._data);
      alert("Synced to cloud ♡");
    },
  };

  // Auto-reconnect on load
  const savedCfg = loadFBConfig();
  if (savedCfg) {
    connectFirebase(savedCfg).catch((e) =>
      console.warn("auto-reconnect failed", e),
    );
  }

  // ----- Anniversary math -----
  function diffParts(anniversary) {
    const a = new Date(anniversary + "T00:00:00");
    const n = new Date();
    n.setHours(0, 0, 0, 0);
    let years = n.getFullYear() - a.getFullYear();
    let months = n.getMonth() - a.getMonth();
    let days = n.getDate() - a.getDate();
    if (days < 0) {
      months -= 1;
      const prev = new Date(n.getFullYear(), n.getMonth(), 0).getDate();
      days += prev;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const totalDays = Math.floor((n - a) / 86400000);
    const next = new Date(n.getFullYear(), a.getMonth(), a.getDate());
    if (next < n) next.setFullYear(next.getFullYear() + 1);
    const daysUntilAnniv = Math.floor((next - n) / 86400000);
    return { years, months, days, totalDays, daysUntilAnniv };
  }

  window.Store = Store;
  window.diffParts = diffParts;
})();
