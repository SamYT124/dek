import { initializeApp } from "https://gstatic.com";
import { getAuth } from "https://gstatic.com";
import { getFirestore, doc, setDoc, getDoc } from "https://gstatic.com";

const firebaseConfig = {
  apiKey: "AIzaSyB1A6K084adH7Dap5ZG5CEAXDSAoHk3owI",
  authDomain: "phumagri.firebaseapp.com",
  projectId: "phumagri",
  storageBucket: "phumagri.firebasestorage.app",
  messagingSenderId: "1049586791624",
  appId: "1:1049586791624:web:451fe2d14773093f6321fd",
  measurementId: "G-3K5MH959EQ"
};

// Initialize the core app first so it exists in memory
const app = initializeApp(firebaseConfig);

// Export variables and methods so they can be imported across any script file
export const auth = getAuth(app);
export const db = getFirestore(app);
export { doc, setDoc, getDoc };

console.log("PhumAgri Firebase services initialized successfully!");
