import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Paste your Firebase config object here.
// Find it in your Firebase project console:
// Project settings > General > Your apps > SDK setup and configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE",
};

// Check that all required environment variables are set and not empty placeholders
export const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "PASTE_YOUR_API_KEY_HERE" &&
  !!firebaseConfig.authDomain &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.storageBucket &&
  !!firebaseConfig.messagingSenderId &&
  !!firebaseConfig.appId;

let app;
let auth: ReturnType<typeof getAuth> | undefined;
let db: ReturnType<typeof getFirestore> | undefined;

if (isFirebaseConfigured) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
    console.warn("Firebase configuration is incomplete. Update src/lib/firebase.ts to enable Firebase services.");
}

export { app, auth, db };
