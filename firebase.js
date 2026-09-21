import { initializeApp } from "https://gstatic.com";
import { getAuth } from "https://gstatic.com";
import { getFirestore } from "https://gstatic.com";

const firebaseConfig = {
  apiKey: "AIzaSyB1A6K084adH7Dap5ZG5CEAXDSAoHk3owI",
  authDomain: "phumagri.firebaseapp.com",
  projectId: "phumagri",
  storageBucket: "phumagri.firebasestorage.app",
  messagingSenderId: "1049586791624",
  appId: "1:1049586791624:web:451fe2d14773093f6321fd",
  measurementId: "G-3K5MH959EQ"
};
const auth = getAuth(app);
const db = getFirestore(app);
const app = initializeApp(firebaseConfig);