// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2gpWygwO06NJCGoSr-xAW32SI9xxapyY",
  authDomain: "nextapp-3c4d6.firebaseapp.com",
  projectId: "nextapp-3c4d6",
  storageBucket: "nextapp-3c4d6.appspot.com",
  messagingSenderId: "876790050201",
  appId: "1:876790050201:web:5a140ea69fafdbf61fb708",
  measurementId: "G-Y803TB50WS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage();
