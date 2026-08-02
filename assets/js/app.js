/* ==========================================================================
   Fretwork — Shared app module
   Storage, state, navigation, streaks, reminders, helpers.
   All data lives in localStorage under the "fretwork" key. No server, no
   account, works offline.
   ========================================================================== */

/* Everything is wrapped in an IIFE so page scripts can safely do
   `const { Store, Progress } = Fretwork;` without redeclaring globals. */
(function () {
"use strict";

const STORE_KEY = "fretwork.v1";

const DEFAULT_STATE = {
  startDate: null,          // ISO date the course began
  currentWeek: 1,
  practiceDays: [],         // ["2026-08-02", ...] days with a completed session
  sessions: [],             // {date, week, minutes, mode, blocks:[names], notes, mood}
  blockProgress: {},        // { "w12": ["Warm-up", ...] } per-week completed block names
  weekDone: [],             // [1,2,3] completed weeks
  songs: [],                // {id, title, artist, status, key, capo, notes, added}
  goals: [],                // {id, text, done, due}
  metrics: [],              // {date, type, value, detail}  e.g. chord change counts
  reminders: {
    enabled: false,
    time: "19:00",
    days: [1, 2, 3, 4, 5, 6, 0],   // 0=Sun
    lastFired: null,
    nudgeIfMissed: true,
  },
  settings: {
    defaultMode: "normal",     // short | normal | long
    tuning: "standard",
    metronomeBpm: 70,
    name: "",
  },
  updatedAt: 0,               // ms timestamp, used by the cloud sync layer
};

/* Some browsers (notably Safari, and Chrome in certain configurations) refuse
   localStorage on file:// pages. Detect that once and fall back to an in-memory
   store so the app still runs — the banner tells the user progress won't save. */
const memoryStore = {};
let STORAGE_OK = true;
const backing = (() => {
  try {
    localStorage.setItem("__fw_test", "1");
    localStorage.removeItem("__fw_test");
    return localStorage;
  } catch (e) {
    STORAGE_OK = false;
    return {
      getItem: (k) => (k in memoryStore ? memoryStore[k] : null),
      setItem: (k, v) => { memoryStore[k] = String(v); },
      removeItem: (k) => { delete memoryStore[k]; },
    };
  }
})();

/* ------------------------------------------------------------------ store */
const Store = {
  _cache: null,
  storageAvailable: () => STORAGE_OK,
  load() {
    if (this._cache) return this._cache;
    try {
      const raw = backing.getItem(STORE_KEY);
      this._cache = raw ? deepMerge(clone(DEFAULT_STATE), JSON.parse(raw)) : clone(DEFAULT_STATE);
    } catch (e) {
      this._cache = clone(DEFAULT_STATE);
    }
    if (!this._cache.startDate) {
      this._cache.startDate = todayISO();
      this.save();
    }
    return this._cache;
  },
  save() {
    this._cache.updatedAt = Date.now();
    try { backing.setItem(STORE_KEY, JSON.stringify(this._cache)); }
    catch (e) { STORAGE_OK = false; }
    window.dispatchEvent(new CustomEvent("fretwork:change"));
  },
  update(fn) { const s = this.load(); fn(s); this.save(); return s; },
  reset() { backing.removeItem(STORE_KEY); this._cache = null; },
  export() { return JSON.stringify(this.load(), null, 2); },
  import(json) {
    const parsed = JSON.parse(json);
    this._cache = deepMerge(clone(DEFAULT_STATE), parsed);
    this.save();
  },
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function deepMerge(base, over) {
  for (const k in over) {
    if (over[k] && typeof over[k] === "object" && !Array.isArray(over[k])) {
      base[k] = deepMerge(base[k] || {}, over[k]);
    } else if (over[k] !== undefined) {
      base[k] = over[k];
    }
  }
  return base;
}

/* ------------------------------------------------------------------ dates */
function todayISO(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function addDays(iso, n) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return todayISO(d);
}
function daysBetween(a, b) {
  return Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000);
}
function prettyDate(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

/* ---------------------------------------------------------------- streaks */
const Progress = {
  streak() {
    const days = [...new Set(Store.load().practiceDays)].sort();
    if (!days.length) return 0;
    let n = 0, cursor = todayISO();
    if (!days.includes(cursor)) {
      cursor = addDays(cursor, -1);
      if (!days.includes(cursor)) return 0;   // broken as of yesterday
    }
    while (days.includes(cursor)) { n++; cursor = addDays(cursor, -1); }
    return n;
  },
  bestStreak() {
    const days = [...new Set(Store.load().practiceDays)].sort();
    let best = 0, run = 0, prev = null;
    for (const d of days) {
      run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1;
      best = Math.max(best, run);
      prev = d;
    }
    return best;
  },
  totalMinutes() { return Store.load().sessions.reduce((s, x) => s + (x.minutes || 0), 0); },
  sessionsThisWeek() {
    const cutoff = addDays(todayISO(), -6);
    return Store.load().sessions.filter((s) => s.date >= cutoff).length;
  },
  minutesLast(nDays) {
    const cutoff = addDays(todayISO(), -(nDays - 1));
    return Store.load().sessions.filter((s) => s.date >= cutoff).reduce((a, b) => a + (b.minutes || 0), 0);
  },
  percentComplete() {
    return Math.round((Store.load().weekDone.length / CURRICULUM.totalWeeks) * 100);
  },
  weekBlocks(weekN) { return Store.load().blockProgress["w" + weekN] || []; },
  toggleBlock(weekN, name) {
    Store.update((s) => {
      const key = "w" + weekN;
      const arr = s.blockProgress[key] || (s.blockProgress[key] = []);
      const i = arr.indexOf(name);
      if (i >= 0) arr.splice(i, 1); else arr.push(name);
    });
  },
  logSession({ minutes, week, mode, blocks = [], notes = "", mood = 3 }) {
    Store.update((s) => {
      const date = todayISO();
      s.sessions.push({ date, week, minutes, mode, blocks, notes, mood, ts: Date.now() });
      if (!s.practiceDays.includes(date)) s.practiceDays.push(date);
    });
  },
  completeWeek(n) {
    Store.update((s) => {
      if (!s.weekDone.includes(n)) s.weekDone.push(n);
      if (s.currentWeek === n && n < CURRICULUM.totalWeeks) s.currentWeek = n + 1;
    });
  },
  uncompleteWeek(n) {
    Store.update((s) => { s.weekDone = s.weekDone.filter((x) => x !== n); });
  },
  practicedToday() { return Store.load().practiceDays.includes(todayISO()); },
  /* Auto-suggested week based on elapsed calendar time, capped by manual position */
  suggestedWeek() {
    const s = Store.load();
    const elapsed = Math.floor(daysBetween(s.startDate, todayISO()) / 7) + 1;
    return Math.min(Math.max(1, elapsed), CURRICULUM.totalWeeks);
  },
};

/* ------------------------------------------------------------------- nav */
const NAV = [
  { href: "index.html", label: "Dashboard" },
  { href: "curriculum.html", label: "Curriculum" },
  { href: "week.html", label: "This Week" },
  { href: "practice.html", label: "Practice" },
  { href: "songs.html", label: "Songs" },
  { href: "tools.html", label: "Tools" },
  { href: "tracker.html", label: "Tracker" },
  { href: "reminders.html", label: "Reminders" },
];

function renderNav(active) {
  const streak = Progress.streak();
  const el = document.getElementById("nav");
  if (!el) return;
  el.className = "nav";
  el.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="brand"><span class="brand-mark">🎸</span><span>Fretwork</span></a>
      <div class="nav-links">
        ${NAV.map((n) => `<a href="${n.href}" class="${n.href === active ? "active" : ""}">${n.label}</a>`).join("")}
      </div>
      <div class="nav-right">
        <div class="streak-pill" title="Consecutive practice days">🔥 ${streak}</div>
        <div id="acct-slot"></div>
      </div>
    </div>`;
}

/* ----------------------------------------------------------------- toast */
function toast(msg, ms = 2200) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast"; t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), ms);
}

/* ------------------------------------------------------------- reminders */
const Reminders = {
  async requestPermission() {
    if (!("Notification" in window)) { toast("Notifications not supported in this browser"); return false; }
    const p = await Notification.requestPermission();
    return p === "granted";
  },
  granted() { return "Notification" in window && Notification.permission === "granted"; },
  fire(title, body) {
    if (!this.granted()) return;
    try { new Notification(title, { body, icon: "assets/icon.svg", tag: "fretwork" }); }
    catch (e) { /* some browsers block constructor outside SW */ }
  },
  /* Checked on every page load and every minute while a tab is open */
  tick() {
    const s = Store.load();
    const r = s.reminders;
    if (!r.enabled || !this.granted()) return;
    const now = new Date();
    const today = todayISO(now);
    if (r.lastFired === today) return;
    if (!r.days.includes(now.getDay())) return;
    const [h, m] = r.time.split(":").map(Number);
    if (now.getHours() * 60 + now.getMinutes() < h * 60 + m) return;
    if (Progress.practicedToday()) return;
    const wk = CURRICULUM.week(s.currentWeek);
    this.fire("Time to practise 🎸", `Week ${s.currentWeek}: ${wk ? wk.title : ""} — ${CURRICULUM.minutes(wk, s.settings.defaultMode)} min planned.`);
    Store.update((st) => { st.reminders.lastFired = today; });
  },
  start() {
    this.tick();
    setInterval(() => this.tick(), 60000);
  },
};

/* ------------------------------------------------------------ chord data */
/* frets: array of 6 (low E → high e). -1 = mute, 0 = open. fingers optional. */
const CHORDS = {
  "Em":     { frets: [0,2,2,0,0,0],  fingers: [0,2,3,0,0,0] },
  "Am":     { frets: [-1,0,2,2,1,0], fingers: [0,0,2,3,1,0] },
  "Dm":     { frets: [-1,-1,0,2,3,1],fingers: [0,0,0,2,3,1] },
  "E":      { frets: [0,2,2,1,0,0],  fingers: [0,2,3,1,0,0] },
  "A":      { frets: [-1,0,2,2,2,0], fingers: [0,0,1,2,3,0] },
  "D":      { frets: [-1,-1,0,2,3,2],fingers: [0,0,0,1,3,2] },
  "G":      { frets: [3,2,0,0,0,3],  fingers: [2,1,0,0,0,3] },
  "C":      { frets: [-1,3,2,0,1,0], fingers: [0,3,2,0,1,0] },
  "F":      { frets: [1,3,3,2,1,1],  fingers: [1,3,4,2,1,1], barre: 1 },
  "Fmaj7":  { frets: [-1,-1,3,2,1,0],fingers: [0,0,3,2,1,0] },
  "Asus2":  { frets: [-1,0,2,2,0,0], fingers: [0,0,1,2,0,0] },
  "Asus4":  { frets: [-1,0,2,2,3,0], fingers: [0,0,1,2,3,0] },
  "Dsus2":  { frets: [-1,-1,0,2,3,0],fingers: [0,0,0,1,2,0] },
  "Dsus4":  { frets: [-1,-1,0,2,3,3],fingers: [0,0,0,1,2,3] },
  "Cadd9":  { frets: [-1,3,2,0,3,3], fingers: [0,2,1,0,3,4] },
  "G7":     { frets: [3,2,0,0,0,1],  fingers: [3,2,0,0,0,1] },
  "C7":     { frets: [-1,3,2,3,1,0], fingers: [0,3,2,4,1,0] },
  "D7":     { frets: [-1,-1,0,2,1,2],fingers: [0,0,0,2,1,3] },
  "E7":     { frets: [0,2,0,1,0,0],  fingers: [0,2,0,1,0,0] },
  "A7":     { frets: [-1,0,2,0,2,0], fingers: [0,0,2,0,3,0] },
  "Cmaj7":  { frets: [-1,3,2,0,0,0], fingers: [0,3,2,0,0,0] },
  "Am7":    { frets: [-1,0,2,0,1,0], fingers: [0,0,2,0,1,0] },
  "Em7":    { frets: [0,2,2,0,3,0],  fingers: [0,1,2,0,3,0] },
  "Dm7":    { frets: [-1,-1,0,2,1,1],fingers: [0,0,0,2,1,1] },
  "Bm":     { frets: [-1,2,4,4,3,2], fingers: [0,1,3,4,2,1], barre: 2 },
  "B7":     { frets: [-1,2,1,2,0,2], fingers: [0,2,1,3,0,4] },
  "F#m":    { frets: [2,4,4,2,2,2],  fingers: [1,3,4,1,1,1], barre: 2 },
  "Bb":     { frets: [-1,1,3,3,3,1], fingers: [0,1,2,3,4,1], barre: 1 },
  "A5":     { frets: [-1,0,2,2,-1,-1],fingers:[0,0,1,2,0,0] },
  "E5":     { frets: [0,2,2,-1,-1,-1],fingers:[0,1,2,0,0,0] },
  "G/B":    { frets: [-1,2,0,0,0,3], fingers: [0,1,0,0,0,3] },
  "C/G":    { frets: [3,3,2,0,1,0],  fingers: [3,4,2,0,1,0] },
  "D/F#":   { frets: [2,-1,0,2,3,2], fingers: [1,0,0,2,4,3] },
  /* Barre and colour shapes used by the song library */
  "Cm":     { frets: [-1,3,5,5,4,3], fingers: [0,1,3,4,2,1], barre: 3 },
  "Fm":     { frets: [1,3,3,1,1,1],  fingers: [1,3,4,1,1,1], barre: 1 },
  "Gm":     { frets: [3,5,5,3,3,3],  fingers: [1,3,4,1,1,1], barre: 3 },
  "Ab":     { frets: [4,6,6,5,4,4],  fingers: [1,3,4,2,1,1], barre: 4 },
  "Eb":     { frets: [-1,6,8,8,8,6], fingers: [0,1,2,3,4,1], barre: 6 },
  "F#":     { frets: [2,4,4,3,2,2],  fingers: [1,3,4,2,1,1], barre: 2 },
  "C#m":    { frets: [-1,4,6,6,5,4], fingers: [0,1,3,4,2,1], barre: 4 },
  "A7sus4": { frets: [-1,0,2,0,3,3], fingers: [0,0,2,0,3,4] },
  "D6/9":   { frets: [-1,-1,0,2,0,0],fingers: [0,0,0,2,0,0] },
  "E/G#":   { frets: [4,-1,2,1,0,0], fingers: [4,0,3,2,0,0] },
  "A/E":    { frets: [0,0,2,2,2,0],  fingers: [0,0,1,2,3,0] },
  "Cmaj9":  { frets: [-1,3,2,4,3,3], fingers: [0,2,1,4,3,3] },
};

const CHORD_GROUPS = [
  { name: "Open majors",   list: ["A","C","D","E","G"] },
  { name: "Open minors",   list: ["Am","Dm","Em","Bm","F#m"] },
  { name: "First barres",  list: ["F","Bb","Bm","F#m"] },
  { name: "Sus & add",     list: ["Asus2","Asus4","Dsus2","Dsus4","Cadd9"] },
  { name: "Sevenths",      list: ["A7","B7","C7","D7","E7","G7"] },
  { name: "Maj7 / min7",   list: ["Cmaj7","Fmaj7","Am7","Dm7","Em7"] },
  { name: "Power & slash", list: ["A5","E5","G/B","C/G","D/F#"] },
];

/* Renders a chord diagram as inline SVG */
function chordSVG(name, size = 1) {
  const c = CHORDS[name];
  if (!c) return "";
  const W = 92 * size, H = 116 * size;
  const left = 16 * size, top = 26 * size;
  const sw = 12 * size, fh = 17 * size;        // string spacing, fret height
  const played = c.frets.filter((f) => f > 0);
  const minF = played.length ? Math.min(...played) : 1;
  const base = minF > 4 ? minF : 1;
  let s = `<svg class="chord-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  // nut or position marker
  if (base === 1) s += `<rect x="${left}" y="${top - 3 * size}" width="${sw * 5}" height="${3.4 * size}" fill="var(--text-2)"/>`;
  else s += `<text x="${left - 6 * size}" y="${top + fh * 0.8}" font-size="${9 * size}" fill="var(--text-3)" text-anchor="end" font-family="monospace">${base}</text>`;
  // grid
  for (let i = 0; i <= 4; i++)
    s += `<line x1="${left}" y1="${top + i * fh}" x2="${left + sw * 5}" y2="${top + i * fh}" stroke="var(--border)" stroke-width="${1 * size}"/>`;
  for (let i = 0; i <= 5; i++)
    s += `<line x1="${left + i * sw}" y1="${top}" x2="${left + i * sw}" y2="${top + 4 * fh}" stroke="var(--border)" stroke-width="${1 * size}"/>`;
  // markers
  c.frets.forEach((f, i) => {
    const x = left + i * sw;
    if (f === -1) {
      s += `<text x="${x}" y="${top - 6 * size}" font-size="${9 * size}" fill="var(--text-3)" text-anchor="middle">✕</text>`;
    } else if (f === 0) {
      s += `<circle cx="${x}" cy="${top - 9 * size}" r="${3.2 * size}" fill="none" stroke="var(--text-2)" stroke-width="${1.3 * size}"/>`;
    } else {
      const rel = f - base + 1;
      if (rel < 1 || rel > 4) return;
      const y = top + (rel - 0.5) * fh;
      s += `<circle cx="${x}" cy="${y}" r="${5.2 * size}" fill="var(--accent)"/>`;
      const fg = c.fingers ? c.fingers[i] : 0;
      if (fg) s += `<text x="${x}" y="${y + 3.2 * size}" font-size="${7.5 * size}" fill="#16110a" text-anchor="middle" font-weight="700">${fg}</text>`;
    }
  });
  s += `<text x="${W / 2}" y="${H - 4 * size}" font-size="${11 * size}" fill="var(--text)" text-anchor="middle" font-weight="700">${name}</text>`;
  return s + "</svg>";
}

/* -------------------------------------------------------------- audio ctx */
let _actx = null;
function audio() {
  if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
  if (_actx.state === "suspended") _actx.resume();
  return _actx;
}
function tone(freq, dur = 0.5, type = "sine", gain = 0.22) {
  const ctx = audio();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + dur + 0.05);
}
function click(accent = false) {
  const ctx = audio();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "square"; o.frequency.value = accent ? 1600 : 900;
  g.gain.setValueAtTime(accent ? 0.3 : 0.16, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);
  o.connect(g); g.connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + 0.06);
}

/* ---------------------------------------------------------------- helpers */
const NOTES = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
const STRING_OPEN = ["E","A","D","G","B","E"];    // index 0 = low E (string 6)
const STRING_LABEL = ["6 (low E)","5 (A)","4 (D)","3 (G)","2 (B)","1 (high e)"];

function noteAt(stringIdx, fret) {
  const open = STRING_OPEN[stringIdx];
  return NOTES[(NOTES.indexOf(open) + fret) % 12];
}
/* Scientific pitch: C4 = middle C, A4 = 440 Hz. Standard tuning is E2 A2 D3 G3 B3 E4. */
const PITCH_CLASS = { C:0, "C#":1, Db:1, D:2, "D#":3, Eb:3, E:4, F:5, "F#":6, Gb:6,
                      G:7, "G#":8, Ab:8, A:9, "A#":10, Bb:10, B:11 };
function noteFreq(name, octave) {
  const midi = 12 * (octave + 1) + (PITCH_CLASS[name] ?? 9);
  return 440 * Math.pow(2, (midi - 69) / 12);
}
function uid() { return Math.random().toString(36).slice(2, 10); }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

/* ------------------------------------------------------------ page init */
function initPage(activeHref) {
  Store.load();
  renderNav(activeHref);
  Reminders.start();
  if (!STORAGE_OK) {
    const b = document.createElement("div");
    b.style.cssText = "background:#e87a6a;color:#16110a;padding:11px 20px;font-size:.87rem;font-weight:600;text-align:center";
    b.innerHTML = "⚠ This browser is blocking local storage, so your progress won't be saved. " +
      "Open the folder in Chrome or Firefox, or serve it locally (see README) to fix this.";
    document.body.insertBefore(b, document.body.firstChild);
  }
}

window.Fretwork = { Store, Progress, Reminders, initPage, toast, chordSVG, CHORDS, CHORD_GROUPS,
  todayISO, addDays, daysBetween, prettyDate, noteAt, noteFreq, tone, click, audio,
  NOTES, STRING_OPEN, STRING_LABEL, uid, clamp, esc };

})();
