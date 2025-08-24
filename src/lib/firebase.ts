import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- PASTE YOUR FIREBASE CONFIG OBJECT HERE ---
// Replace the placeholder object below with the actual firebaseConfig
// object you copied from your Firebase project console.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBkuc0GHwlQ6OHjL0QAAty045joH-fh4_k",
  authDomain: "cybersecurity-roadmap.firebaseapp.com",
  projectId: "cybersecurity-roadmap",
  storageBucket: "cybersecurity-roadmap.firebasestorage.app",
  messagingSenderId: "891162783282",
  appId: "1:891162783282:web:b0b69a354112b9e4e7162b",
  measurementId: "G-6LNB892C5Z"
};
// ---------------------------------------------


// Check that all required environment variables are set
export const isFirebaseConfigured =
  firebaseConfig &&
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "AIzaSyBkuc0GHwlQ6OHjL0QAAty045joH-fh4_k" &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId;

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
