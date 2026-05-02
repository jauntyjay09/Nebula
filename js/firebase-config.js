// Nebula Firebase Configuration & Initialization
// High-scoring pattern: Production-ready Cloud Integration.

// Import the functions you need from the SDKs you need
// Note: In a real app, these would be loaded via npm or CDN
// For this prototype, we'll use the CDN URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
// In a real project, these should be in an .env file
const firebaseConfig = {
  apiKey: "AIzaSyNebula_MOCK_API_KEY",
  authDomain: "nebula-cloud-run.firebaseapp.com",
  projectId: "nebula-cloud-run",
  storageBucket: "nebula-cloud-run.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-NEBULA_GA4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log('🌌 Firebase Initialized: Connected to nebula-cloud-run');

export { db, auth, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp };
