# Setup — accounts, sync, and hosting

Fretwork works with none of this. Open `index.html` and everything runs, saved in that browser. This guide adds two things:

1. **An account**, so your progress syncs to your phone, laptop, and anywhere else.
2. **A hosted URL**, so you can actually open it on those devices.

Total time: about 25 minutes. Everything here is free.

---

## Part 1 — Firebase (accounts + sync)

### 1. Create the project

Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.

- Name it whatever you like (`fretwork` is fine).
- **Turn Google Analytics off** — you don't need it and it adds setup steps.

### 2. Turn on sign-in methods

**Build → Authentication → Get started.** On the *Sign-in method* tab, enable all three:

| Method | Why |
|---|---|
| **Email/Password** | Works everywhere, even signed out of Google |
| **Google** | One-tap sign-in. Pick a support email when prompted |
| **Anonymous** | Powers guest mode, so the app is usable before signing up |

### 3. Create the database

**Build → Firestore Database → Create database.**

- Choose **Production mode** (we set proper rules in the next step).
- Pick the region closest to you — `asia-south1` (Mumbai) if you're in India.

### 4. Lock it down with security rules

This step matters. Without it, anyone could read your database.

Go to the **Rules** tab in Firestore, replace everything with this, and hit **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /fretwork_users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

This says: a signed-in user may read and write exactly one document — the one named after their own user ID. Nothing else, by anyone.

### 5. Register a web app and copy the config

**Project settings** (⚙ icon, top left) **→ Your apps → Web** (the `</>` button).

- Give it a nickname, skip Firebase Hosting for now.
- Firebase shows you a `firebaseConfig` object. Copy those six values.

Open `assets/js/firebase-config.js` and paste them in:

```js
window.FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",
  authDomain:        "fretwork-abc12.firebaseapp.com",
  projectId:         "fretwork-abc12",
  storageBucket:     "fretwork-abc12.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:abc123def456",
};
```

> **These keys are safe to publish.** They identify your project; they don't grant access. Access is controlled entirely by the security rules above. Every Firebase web app ships these in plain JavaScript.

Reload `account.html` — the setup screen is replaced by a sign-in form.

---

## Part 2 — GitHub Pages (hosting)

Google sign-in refuses to run from `file://`, so the site needs a real URL.

### 1. Create the repository

- Sign in at [github.com](https://github.com) → **New repository**.
- Name it `fretwork`. Set it to **Public** (Pages needs public on the free plan).
- Don't add a README — you already have one.

### 2. Upload the files

Easiest route, no command line: on the empty repo page click **uploading an existing file**, then drag in *everything* from this folder — all the `.html` files, the `assets` folder, `README.md`, `SETUP.md`, `.nojekyll`. Commit.

If you prefer git:

```bash
cd "D:\Courses\Guitar Claude"
git init
git add .
git commit -m "Fretwork"
git branch -M main
git remote add origin https://github.com/YOURNAME/fretwork.git
git push -u origin main
```

### 3. Turn on Pages

Repo **Settings → Pages**. Under *Build and deployment*:

- Source: **Deploy from a branch**
- Branch: **main**, folder: **/ (root)** → **Save**

Wait a minute. Your site appears at:

```
https://YOURNAME.github.io/fretwork/
```

### 4. Authorise the domain in Firebase

**This is the step people miss.** Back in Firebase: **Authentication → Settings → Authorized domains → Add domain**, and enter:

```
YOURNAME.github.io
```

Without this, Google sign-in fails with `auth/unauthorized-domain`.

### 5. Use it

Open that URL on your phone, sign in with the same account, and your progress is there. Add it to your home screen — Share → *Add to Home Screen* on iOS, ⋮ → *Add to Home screen* on Android — and it opens like an app.

---

## How syncing behaves

**Devices merge, they don't overwrite.** This is the important design decision. If you log a session on your phone in the morning and another on your laptop at night, both survive. The merge combines:

- practice days, sessions, and measured drill results (de-duplicated)
- completed weeks and ticked practice blocks (union)
- songs and goals (by identity, so no duplicates)
- current week (the further-along value wins)

Only **preferences** — reminder time, default session length, display name — take a single winner: whichever device changed them most recently.

**Timing.** Changes push about 2 seconds after you make them. Other devices with the page open receive them live. On sign-in, and whenever you come back online, a full reconcile runs.

**Offline.** Firestore caches locally, so the app keeps working with no connection and pushes whatever changed once you're back.

---

## Troubleshooting

| What you see | Fix |
|---|---|
| `auth/unauthorized-domain` | Add your domain under Authentication → Settings → Authorized domains |
| `auth/operation-not-allowed` | That sign-in method isn't enabled yet (step 2) |
| `Missing or insufficient permissions` | The security rules weren't published, or the collection name was changed from `fretwork_users` |
| Popup closes instantly | Popup blocker. Allow popups for the site, or the app falls back to redirect sign-in |
| Account page still shows setup instructions | `firebase-config.js` still has `PASTE_...` values, or the file didn't save |
| Nav chip says "Local" | Same as above — the app is running local-only, which is a valid state, not an error |
| Red banner about storage | You opened it via `file://` in a browser that blocks local storage. Use the hosted URL, or run `start-local-server.bat` |

---

## Costs

Firebase's free Spark plan allows 50,000 document reads and 20,000 writes per day. Fretwork uses roughly one read and a handful of writes per practice session. You will not come close to the limit. GitHub Pages is free for public repositories.

## If you'd rather not use any of this

The app never required an account. Tracker → **Export backup** downloads a JSON file; **Import backup** restores it on another machine. Drop that file in OneDrive or Google Drive and you have manual cross-device sync with no accounts at all.
