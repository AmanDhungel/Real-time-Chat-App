// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage,ref  } from "firebase/storage";
import { getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuNxFlhCBMM-La_QNeAIPPfizj6WGnnA4",
  authDomain: "chatapp-3e621.firebaseapp.com",
  projectId: "chatapp-3e621",
  storageBucket: "chatapp-3e621.appspot.com",
  messagingSenderId: "420786752348",
  appId: "1:420786752348:web:908dfb0707c6acb12c4f99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseApp = getApp();

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(firebaseApp, "gs://chatapp-3e621.appspot.com");
export const storageRef = ref(storage);
export const imagesRef = ref(storageRef, 'images');
