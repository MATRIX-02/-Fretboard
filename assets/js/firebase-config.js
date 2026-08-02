/* ==========================================================================
   Fretwork — Firebase configuration

   Paste your own project's values below. Until you do, the app runs in
   LOCAL-ONLY mode: everything works exactly as before, saved in this browser,
   with the account features hidden.

   Where to get these values (takes about 10 minutes — full walkthrough in
   SETUP.md):
     1. console.firebase.google.com → Add project
     2. Build → Authentication → Get started → enable "Email/Password",
        "Google", and "Anonymous"
     3. Build → Firestore Database → Create database → Production mode
     4. Project settings (⚙) → Your apps → Web (</>) → register the app
     5. Copy the firebaseConfig object it shows you into the block below
   ========================================================================== */

window.FIREBASE_CONFIG = {
  apiKey:            "PASTE_YOUR_API_KEY",
  authDomain:        "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId:         "PASTE_YOUR_PROJECT_ID",
  storageBucket:     "PASTE_YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId:             "PASTE_YOUR_APP_ID",
};

/* These keys are safe to commit publicly — they identify your project, they
   don't grant access. Access is controlled by the Firestore security rules in
   SETUP.md, which restrict every user to their own document. */
