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
  apiKey:            "AIzaSyBAwkonS3iixgmP1OQR-F3oMAAGgSNpi9k",
  authDomain:        "fretboard-aa6ca.firebaseapp.com",
  projectId:         "fretboard-aa6ca",
  storageBucket:     "fretboard-aa6ca.firebasestorage.app",
  messagingSenderId: "2867236032",                            
  appId:             "1:2867236032:web:45b22106ffab645b457125",
};

/* These keys are safe to commit publicly — they identify your project, they
   don't grant access. Access is controlled by the Firestore security rules in
   SETUP.md, which restrict every user to their own document. */
