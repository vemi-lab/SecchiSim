import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAz7_L3oaiLF52rPkhfMqJTEAa3fhn5bUM",
  authDomain: "secchisim-vemi-4f776.firebaseapp.com",
  projectId: "secchisim-vemi-4f776",
  storageBucket: "secchisim-vemi-4f776.appspot.com",
  messagingSenderId: "894048278189",
  appId: "1:894048278189:web:5c7f52afbbecb854369824",
  measurementId: "G-6NSPKVGKQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const  auth = getAuth(app);