import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKRJb_9JwrM0VOFHqv0ojAOjumY0U-UM0",
  authDomain: "my-expo-chat-app-1.firebaseapp.com",
  projectId: "my-expo-chat-app-1",
  storageBucket: "my-expo-chat-app-1.firebasestorage.app",
  messagingSenderId: "412175177754",
  appId: "1:412175177754:web:c9d0501722a25f1430d9a3",
  measurementId: "G-XMEWHDJ8BQ"
};

// Initialize modular SDK
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize compat SDK (required for expo-firebase-recaptcha)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
