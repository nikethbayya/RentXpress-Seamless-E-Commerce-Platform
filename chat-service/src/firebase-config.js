// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbY3LQk7EIURl2GSAkywBgYDkB3-3o8zs",
  authDomain: "rentitall-chat-service-c327e.firebaseapp.com",
  projectId: "rentitall-chat-service-c327e",
  storageBucket: "rentitall-chat-service-c327e.appspot.com",
  messagingSenderId: "426614930853",
  appId: "1:426614930853:web:227c99fa291520d8657c4c",
  measurementId: "G-83MF7DVCPM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();