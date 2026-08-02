/* ==========================================================================
   Fretwork — Accounts & cross-device sync

   Design principles:
   • Local-first. The app is fully usable with no account and no internet.
     Firebase is an optional layer on top, never a dependency.
   • Never lose data. Devices are merged, not overwritten. If you practise on
     your phone and your laptop on the same day, both sessions survive.
   • Degrade silently. No config, no network, blocked CDN → local-only mode.
   ========================================================================== */

(function () {
"use strict";

const { Store, Progress, toast, esc } = window.Fretwork || {};
if (!Store) { console.warn("[sync] Fretwork core not loaded"); return; }

const COLLECTION = "fretwork_users";
let app = null, auth = null, db = null;
let user = null;
let mode = "local";           // local | ready | signed-in
let pushTimer = null;
let suspendPush = false;
let unsubscribeDoc = null;
let lastSyncedAt = null;
let statusText = "Local only";

/* ------------------------------------------------------------- availability */
function configured() {
  const c = window.FIREBASE_CONFIG;
  return !!(c && c.apiKey && !String(c.apiKey).startsWith("PASTE_"));
}
function sdkLoaded() { return typeof window.firebase !== "undefined" && !!firebase.initializeApp; }

/* ------------------------------------------------------------------- merge */
/* Union-merge two states. Neither side wins outright — arrays are combined and
   de-duplicated, scalars take the more advanced / more recent value. */
/* How much real use a state represents. A freshly installed device scores 0,
   and its default preferences must never overwrite a real account's. */
function activity(s) {
  return (s.sessions || []).length + (s.practiceDays || []).length +
         (s.weekDone || []).length + (s.songs || []).length + (s.goals || []).length;
}

function mergeStates(a, b) {
  if (!a) return b; if (!b) return a;

  /* Preference winner: a used device always beats a pristine one. Between two
     used devices, the more recently changed wins. */
  let newer;
  const actA = activity(a), actB = activity(b);
  if (actA === 0 && actB > 0) newer = b;
  else if (actB === 0 && actA > 0) newer = a;
  else newer = (b.updatedAt || 0) >= (a.updatedAt || 0) ? b : a;
  const older = newer === b ? a : b;

  const uniq = (arr) => [...new Set(arr)].sort();
  const byKey = (arrA, arrB, key) => {
    const out = new Map();
    [...(arrA || []), ...(arrB || [])].forEach((x) => {
      const k = typeof key === "function" ? key(x) : x[key];
      if (!out.has(k)) out.set(k, x);
    });
    return [...out.values()];
  };

  const blockProgress = {};
  for (const k of new Set([...Object.keys(a.blockProgress || {}), ...Object.keys(b.blockProgress || {})])) {
    blockProgress[k] = uniq([...(a.blockProgress?.[k] || []), ...(b.blockProgress?.[k] || [])]);
  }

  return {
    startDate: [a.startDate, b.startDate].filter(Boolean).sort()[0] || null,
    currentWeek: Math.max(a.currentWeek || 1, b.currentWeek || 1),
    weekDone: uniq([...(a.weekDone || []), ...(b.weekDone || [])]),
    practiceDays: uniq([...(a.practiceDays || []), ...(b.practiceDays || [])]),
    sessions: byKey(a.sessions, b.sessions,
      (s) => s.ts || `${s.date}|${s.week}|${s.minutes}|${(s.notes || "").slice(0, 24)}`)
      .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0)),
    metrics: byKey(a.metrics, b.metrics,
      (m) => `${m.date}|${m.type}|${m.value}|${m.detail || ""}`)
      .sort((x, y) => (x.date < y.date ? -1 : 1)),
    songs: byKey(a.songs, b.songs, (s) => (s.title || "").toLowerCase() + "|" + (s.artist || "").toLowerCase()),
    goals: byKey(a.goals, b.goals, (g) => g.id || g.text),
    blockProgress,
    /* Preferences are not mergeable — the more recently touched device wins. */
    reminders: { ...older.reminders, ...newer.reminders },
    settings:  { ...older.settings,  ...newer.settings,
                 habits: { ...(older.settings?.habits || {}), ...(newer.settings?.habits || {}) } },
    updatedAt: Math.max(a.updatedAt || 0, b.updatedAt || 0),
  };
}

/* ------------------------------------------------------------------ remote */
function docRef() { return db.collection(COLLECTION).doc(user.uid); }

async function pull() {
  if (mode !== "signed-in") return null;
  const snap = await docRef().get();
  return snap.exists ? snap.data().state || null : null;
}

async function push(state) {
  if (mode !== "signed-in") return;
  await docRef().set({
    state,
    updatedAt: Date.now(),
    email: user.email || null,
    device: navigator.userAgent.slice(0, 120),
  }, { merge: true });
  lastSyncedAt = Date.now();
}

/* Full reconcile: pull remote, merge with local, write both directions. */
async function reconcile(reason) {
  if (mode !== "signed-in") return;
  setStatus("Syncing…");
  try {
    const remote = await pull();
    const local = Store.load();
    const merged = mergeStates(local, remote);
    merged.updatedAt = Date.now();

    suspendPush = true;
    Store.import(JSON.stringify(merged));
    suspendPush = false;

    await push(merged);
    setStatus("Synced");
    window.dispatchEvent(new CustomEvent("fretwork:synced", { detail: { reason } }));
  } catch (e) {
    console.warn("[sync] reconcile failed", e);
    setStatus("Sync failed — working locally");
  }
}

function schedulePush() {
  if (mode !== "signed-in" || suspendPush) return;
  clearTimeout(pushTimer);
  setStatus("Saving…");
  pushTimer = setTimeout(async () => {
    try {
      const s = Store.load();
      s.updatedAt = Date.now();
      await push(s);
      setStatus("Synced");
    } catch (e) { setStatus("Offline — will retry"); }
  }, 1800);
}

/* Live updates from your other devices */
function watch() {
  if (unsubscribeDoc) unsubscribeDoc();
  unsubscribeDoc = docRef().onSnapshot((snap) => {
    if (!snap.exists || snap.metadata.hasPendingWrites) return;
    const remote = snap.data().state;
    if (!remote) return;
    const local = Store.load();
    /* Always merge rather than compare clocks — device clocks drift, and the
       merge is idempotent, so this can't lose data. Bail only if nothing
       actually changed, which is what stops an update loop. */
    const merged = mergeStates(local, remote);
    const before = JSON.stringify({ ...local, updatedAt: 0 });
    const after = JSON.stringify({ ...merged, updatedAt: 0 });
    if (before === after) return;
    suspendPush = true;
    Store.import(JSON.stringify(merged));
    suspendPush = false;
    setStatus("Updated from another device");
    window.dispatchEvent(new CustomEvent("fretwork:synced", { detail: { reason: "remote" } }));
  }, (e) => console.warn("[sync] watch error", e));
}

/* -------------------------------------------------------------------- auth */
const Auth = {
  async google() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        return await auth.currentUser.linkWithPopup(provider);
      }
      return await auth.signInWithPopup(provider);
    } catch (e) {
      if (e.code === "auth/credential-already-in-use" || e.code === "auth/email-already-in-use") {
        return await auth.signInWithPopup(provider);   // account exists — just sign in
      }
      if (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment") {
        return await auth.signInWithRedirect(provider);
      }
      throw e;
    }
  },
  async emailSignUp(email, password) {
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      const cred = firebase.auth.EmailAuthProvider.credential(email, password);
      try { return await auth.currentUser.linkWithCredential(cred); }
      catch (e) { if (e.code !== "auth/email-already-in-use") throw e; }
    }
    return await auth.createUserWithEmailAndPassword(email, password);
  },
  async emailSignIn(email, password) {
    return await auth.signInWithEmailAndPassword(email, password);
  },
  async guest() { return await auth.signInAnonymously(); },
  async resetPassword(email) { return await auth.sendPasswordResetEmail(email); },
  async signOut() {
    if (unsubscribeDoc) { unsubscribeDoc(); unsubscribeDoc = null; }
    await auth.signOut();
  },
  async deleteCloudData() {
    if (mode !== "signed-in") return;
    await docRef().delete();
    setStatus("Cloud copy deleted");
  },
};

/* Friendlier wording than Firebase's raw codes */
function readableError(e) {
  const m = {
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/user-not-found": "No account with that email. Try creating one instead.",
    "auth/wrong-password": "Wrong password. Use 'Forgot password' if you need a reset.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/email-already-in-use": "An account already exists with that email — sign in instead.",
    "auth/weak-password": "Password needs to be at least 6 characters.",
    "auth/popup-closed-by-user": "Sign-in window was closed.",
    "auth/network-request-failed": "No connection. Your work is still saved locally.",
    "auth/unauthorized-domain": "This domain isn't authorised in Firebase. Add it under Authentication → Settings → Authorized domains.",
    "auth/operation-not-allowed": "That sign-in method isn't enabled yet in the Firebase console.",
    "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
  };
  return m[e && e.code] || (e && e.message) || "Something went wrong.";
}

/* ----------------------------------------------------------------- nav chip */
function setStatus(t) { statusText = t; paintChip(); }

function paintChip() {
  const slot = document.getElementById("acct-slot");
  if (!slot) return;
  if (mode === "local") {
    slot.innerHTML = `<a href="account.html" class="streak-pill" title="Set up an account to sync across devices">☁ Local</a>`;
    return;
  }
  if (!user) {
    slot.innerHTML = `<a href="account.html" class="streak-pill" style="border-color:var(--accent-line);color:var(--accent)">Sign in</a>`;
    return;
  }
  const label = user.isAnonymous ? "Guest" : (user.email ? user.email.split("@")[0] : "Account");
  const dot = statusText === "Synced" ? "var(--good)"
            : statusText.startsWith("Sync") || statusText === "Saving…" ? "var(--accent)"
            : "var(--bad)";
  slot.innerHTML = `<a href="account.html" class="streak-pill" title="${esc(statusText)}">
      <span style="width:7px;height:7px;border-radius:50%;background:${dot};display:inline-block"></span>
      ${esc(label)}</a>`;
}

/* ------------------------------------------------------------------- init */
function init() {
  if (!configured() || !sdkLoaded()) {
    mode = "local";
    setTimeout(paintChip, 0);
    return;
  }
  try {
    app = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.FIREBASE_CONFIG);
    auth = firebase.auth();
    db = firebase.firestore();
    db.enablePersistence({ synchronizeTabs: true }).catch(() => {});  // offline cache
    mode = "ready";
  } catch (e) {
    console.warn("[sync] Firebase init failed", e);
    mode = "local"; setTimeout(paintChip, 0); return;
  }

  auth.onAuthStateChanged(async (u) => {
    user = u;
    if (u) {
      mode = "signed-in";
      await reconcile("sign-in");
      watch();
    } else {
      mode = "ready";
      setStatus("Not signed in");
    }
    paintChip();
    window.dispatchEvent(new CustomEvent("fretwork:auth", { detail: { user: u } }));
  });

  window.addEventListener("fretwork:change", schedulePush);
  window.addEventListener("online", () => { if (mode === "signed-in") reconcile("online"); });
  setTimeout(paintChip, 0);
}

window.Sync = {
  init, Auth, reconcile, mergeStates, readableError,
  get mode() { return mode; },
  get user() { return user; },
  get status() { return statusText; },
  get lastSyncedAt() { return lastSyncedAt; },
  configured, sdkLoaded,
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

})();
