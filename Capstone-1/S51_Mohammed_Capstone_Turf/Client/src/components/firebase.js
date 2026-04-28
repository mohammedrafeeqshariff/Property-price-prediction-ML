// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAS8RRLLRNpRDRR2yKxFthr1aFwFlGMw1I",
  authDomain: "capstone-image-1c9ac.firebaseapp.com",
  projectId: "capstone-image-1c9ac",
  storageBucket: "capstone-image-1c9ac.appspot.com",
  messagingSenderId: "428550647655",
  appId: "1:428550647655:web:13528efe485df26dc5c9c2",
  measurementId: "G-6K5T25RT3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;